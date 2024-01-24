const { chromium } = require("playwright");
const readline = require("readline");
const fs = require("fs");
const storageService = require("./services/storageService");
const logger = require("./utils/logger");
const {
  sendWechatNotification,
  sendFile,
  sendImageToWebhook,
} = require("./services/wechatService");

const SEARCH_API_URL =
  "https://edith.xiaohongshu.com/api/sns/web/v1/search/notes";
const cookiesFilePath = "./data/cookies.json";
const keywords = ["防水维修", "懂防水", "防水发白"]; // Add more keywords as needed
const maxRetries = 3; // Maximum number of retries
let timeout = 60000; // Initial timeout
const pagesToCapture = 10; // Number of pages to capture

// 定义手机号
const mobileNumber = "18600372156";
const startTime = new Date();

// 创建 readline 接口用于命令行输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const randomWaitTime = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000;

async function processRequest(page) {
  page.on("request", (request) => {
    if (request.resourceType() === "xhr") {
      // logger.info('XHR request:', request.url());
      // 这里可以进一步处理每个XHR请求
    }
  });
}

async function processResponse(response) {
  const url = response.url();
  if (url.includes(SEARCH_API_URL)) {
    logger.info("[browserSearchSpider] Processing response:", url);
    try {
      const responseBody = await response.json();
      // 遍历搜索结果
      const records = responseBody.data.items
        .map((item) => {
          if (item.note_card) {
            const noteCard = item.note_card;
            return {
              url: "https://www.xiaohongshu.com/explore/" + item.id,
              display_title: noteCard.display_title || "标题不可用",
              user_nickname: noteCard.user
                ? noteCard.user.nickname
                : "昵称不可用",
              liked_count: noteCard.interact_info
                ? noteCard.interact_info.liked_count
                : "点赞数量不可用",
              type: noteCard.type || "类型不可用",
              // Add other fields here
              fields: [
                "url",
                "display_title",
                "user_nickname",
                "liked_count",
                "type",
              ], // Add this line
            };
          }
        })
        .filter(Boolean);
      logger.info(`Total records: ${records.length}`);
      // Save records to CSV file
      await storageService.writeDataWithDuplicationCheck(
        "./data/out.csv",
        records,
        records[0].fields,
        ["url"]
      );
      logger.info("[browserSearchSpider] Saved records to CSV file");
    } catch (error) {
      logger.error(
        "[browserSearchSpider] An error occurred while processing response:",
        error
      );
    }
  }
}

async function login(page, mobileNumber) {
  // 输入手机号
  await page.fill('input[name="xhs-pc-web-phone"]', mobileNumber);

  // 勾选同意阅读复选框（如果存在）
  await page.click("svg.radio");

  // 点击获取验证码
  await page.click(".code-button");

  // 请求命令行输入验证码并等待用户输入
  const verificationCode = await new Promise((resolve) => {
    rl.question("请输入验证码：", (code) => resolve(code));
  });

  // 输入验证码
  await page.fill('input[placeholder="输入验证码"]', verificationCode);

  // 点击登录按钮
  await page.click("button.submit");

  // 等待一段时间以确保登录成功
  await page.waitForTimeout(9000);

  // 登录成功后截图
  await page.screenshot({ path: "login_success.png" });
  logger.info("登录成功，截图已保存。");
}

async function searchForKeyword(page, keyword) {
  await page.waitForSelector(".search-input", {
    state: "visible",
    timeout: 60000,
  });
  // 点击搜索框以激活或聚焦
  await page.click(".search-input");
  // 输入关键词并提交搜索
  logger.info(`Keyword: ${keyword}`);

  await page.fill(".search-input", keyword);
  await page.click(".search-icon");

  // 等待页面反应（如有必要）
  await page.waitForTimeout(5000); // 可根据实际情况调整等待时间

  // 定位并点击下拉列表以展开它
  await page.click("div.filter-box div.filter");
    
  // 等待下拉列表动画完成（可根据需要调整等待时间）
  await page.waitForTimeout(1000); // 1秒等待

  // 点击“最新”选项
  await page.click('div.dropdown-items span.text:has-text("最新")');

  page.on("response", processResponse);
  await page.waitForTimeout(10000); // 可根据实际情况调整等待时间

  // 循环使用键盘翻页并截图
  for (let i = 0; i < pagesToCapture; i++) {
    // 截图
    await page.screenshot({
      path: `./data/screenshot/search_results_${i}.png`,
    });
    logger.info(`搜索结果截图 ${i} 已保存。`);

    // Send the screenshot to WeChat Work
    await sendImageToWebhook(`./data/screenshot/search_results_${i}.png`);
    // 使用键盘进行翻页
    await page.keyboard.press("PageDown");

    // 等待随机时间
    await page.waitForTimeout(randomWaitTime);
  }
}

logger.info("Program started");

(async () => {
  // Send a notification to WeChat Work
  const message = `我将开始为你自动在小红书上搜索“${keywords}”的最新内容，我会随后将工作截屏和搜索返回的数据内容发送出来，当前时间：${new Date().toLocaleString()}`;
  await sendWechatNotification(message);

  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext();

  // 如果存在 cookies 文件，则从文件中读取并设置 cookies
  if (fs.existsSync(cookiesFilePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await context.addCookies(cookies);
  }

  const page = await context.newPage();

  await page.addInitScript(() => {
    delete navigator.__proto__.webdriver;
    navigator.languages = ["en-US", "en"];
    navigator.platform = "Win32";
    navigator.plugins = [1, 2, 3, 4, 5];
  });

  await page.setExtraHTTPHeaders({
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
  });

  try {
    await processRequest(page);

    logger.info("Processing request...");

    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.goto("https://www.xiaohongshu.com/explore", { timeout });
        break; // If successful, break out of the loop
      } catch (error) {
        if (i === maxRetries - 1) throw error; // If all retries failed, rethrow the error
        timeout += 30000; // Increase timeout by 30 seconds
      }
    }
    // 检查是否已登录
    if (
      (await page.$(
        'li.user.side-bar-component span.channel:has-text("我")'
      )) === null
    ) {
      await login(page, mobileNumber);
    }

    for (const keyword of keywords) {
      await searchForKeyword(page, keyword);
    }
    // 获取并保存 cookies
    const cookies = await context.cookies();
    fs.writeFileSync(cookiesFilePath, JSON.stringify(cookies, null, 2));

    // Send the file to WeChat Work
    await sendFile("./data/out.csv", "小红书搜索结果-最新内容");

    logger.info("Program completed");

    const endTime = new Date();
    const totalTime = endTime - startTime;

    // Format the message
    const message = `我已经完成了本次的搜索和数据采集任务，工作成果已经发出，总共用时是${
      totalTime / 1000
    }秒`;

    // Send the message
    await sendWechatNotification(message);
  } catch (err) {
    logger.error("An uncaught exception occurred: ", err);
  } finally {
    // 关闭 readline 接口
    rl.close();

    // 关闭浏览器
    await browser.close();
  }
})();

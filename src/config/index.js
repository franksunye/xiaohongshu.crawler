const config = {
    baseUrl: 'https://www.xiaohongshu.com/web_api/sns/v3/page/notes',
    sortType: 'new',
    headers: {
        userAgents: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
            'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/90.0.4430.212 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0',
            'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/33.1 Mobile/15E148 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/73.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
        ],

        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh;q=0.8,zh-CN;q=0.7',
        'Cache-Control': 'no-cache',
        'Cookie': 'abRequestId=710da8d9-09fc-56f2-8b78-ac99420c48fc; a1=18bf5595f37b4dhh43rpc1aypxk81yemkbcpg12jf50000250456; webId=c70d36df4e838f2bcf10af8e74afe175; gid=yYDi22jKW2TyyYDi22j2iDyJqWD4fxx4qFUSSViy0vUCTU28Yyvd6k888J2842K8Yf2yY88Y; customerClientId=133478825816367; web_session=0400698f3445cc560f9e7aaa5e374b714e7ded; websectiga=a9bdcaed0af874f3a1431e94fbea410e8f738542fbb02df1e8e30c29ef3d91ac; xsecappid=sns-topic',
        'Pragma': 'no-cache',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'X-B3-Traceid': 'd2b3ac4e588ef7f7',
        'X-S': 'Z65W02FK1lAp0gO612aJsg9Wsi5KZBO6Zg1+OgwBZj13',
        'X-T': '1701671295102'
    },
    // logToConsole: process.env.NODE_ENV !== 'pro', // 在生产环境中禁用控制台日志输出
    logToConsole: true,
    // ...
};

if (process.env.NODE_ENV === 'pro') {
    // PRO 修链房屋
    // 生产环境的配置
    config.WeChatBotKey = '31ecfdfb-f0d4-4a80-bc13-94c267d6c32c',
    config.WeChatBotURL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=31ecfdfb-f0d4-4a80-bc13-94c267d6c32c',
    config.requestInterval = 10000; // 200秒间隔
    config.maxRequests = 10; // 最大请求次数
    config.pageSize = 10;
    config.topicsCsvFilePath = './topics.csv';
    config.noteLogCsvFilePath = './noteLog.csv';
    config.topicLogCsvFilePath = './topicLog.csv';
} else {
    // DEV 董灿科技
    // 开发环境的配置
    config.WeChatBotKey = '757f09da-1f82-453d-b24f-aeddb17c04a0',
    config.WeChatBotURL= 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=757f09da-1f82-453d-b24f-aeddb17c04a0',
    config.requestInterval = 10000; // 100秒间隔
    config.maxRequests = 1;
    config.pageSize = 5;
    config.topicsCsvFilePath = './topics-dev.csv';
    config.noteLogCsvFilePath = './noteLog-dev.csv';
    config.topicLogCsvFilePath = './topicLog-dev.csv';
}

module.exports = config;


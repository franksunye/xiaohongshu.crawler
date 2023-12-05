const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const app = new Koa();
const router = new Router();

router.get('/topiclogs', async (ctx) => {
    // 获取话题日志
    const logs = fs.readFileSync('topicLog.csv', 'utf8');
    ctx.body = logs;
});

router.get('/notelogs', async (ctx) => {
    // 获取笔记日志
    const logs = fs.readFileSync('noteLog.csv', 'utf8');
    ctx.body = logs;
});

router.get('/topics', async (ctx) => {
    // 获取所有话题
    const topics = fs.readFileSync('topics.csv', 'utf8');
    ctx.body = topics;
});

router.delete('/topics/:id', async (ctx) => {
    // 删除一个话题
    // 这需要一些额外的逻辑来从文件中删除一行
    // 你可能需要读取文件，然后找到并删除对应的行，然后将结果写回文件
});

router.get('/logs/dev', async (ctx) => {
    // 获取开发日志
    const logs = fs.readFileSync('development.log', 'utf8');
    ctx.body = logs;
});

router.get('/logs/ops', async (ctx) => {
    // 获取运营日志
    const logs = fs.readFileSync('operation.log', 'utf8');
    ctx.body = logs;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
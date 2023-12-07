const Koa = require('koa');
const Router = require('@koa/router');
const topicsRouter = require('./api/topics');
const notesRouter = require('./api/notes');
const topicConfigsRouter = require('./api/topicConfigs');
const topicStatsRouter = require('./api/topicStats');
const app = new Koa();
const router = new Router();

router.use('/api', topicsRouter.routes());
router.use('/api', notesRouter.routes());
router.use('/api', topicConfigsRouter.routes());
router.use('/api', topicStatsRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
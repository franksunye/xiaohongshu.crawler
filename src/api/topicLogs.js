const Router = require('@koa/router');
const topicLogsController = require('./controllers/topicLogsController');
const router = new Router();

router.get('/topicLogs', topicLogsController.getAllLogs);
router.get('/topicLogs/:id', topicLogsController.getLogById);
router.post('/topicLogs', topicLogsController.createLog);

module.exports = router;
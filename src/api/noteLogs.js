const Router = require('@koa/router');
const noteLogsController = require('./controllers/noteLogsController');
const router = new Router();

router.get('/noteLogs', noteLogsController.getAllLogs);
router.get('/noteLogs/:id', noteLogsController.getLogById);
router.post('/noteLogs', noteLogsController.createLog);

module.exports = router;
const Router = require('@koa/router');
const noteLogsController = require('./controllers/noteLogsController');
const router = new Router();

// GET /noteLogs?page=2&pageSize=10&sortField=create_time&sortOrder=desc
router.get('/noteLogs', noteLogsController.getLogsByPageAndSort);

router.get('/noteAllLogs', noteLogsController.getAllLogs);
router.get('/noteLogs/:id', noteLogsController.getLogById);
router.post('/noteLogs', noteLogsController.createLog);
router.get('/noteLogsCount', noteLogsController.countLogs);

module.exports = router;
const Router = require('@koa/router');
const topicStatsController = require('./controllers/topicStatsController');
const router = new Router();

router.get('/topicStats/:id', topicStatsController.getById);
router.put('/topicStats/:id', topicStatsController.update);

module.exports = router;
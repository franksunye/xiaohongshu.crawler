const Router = require('@koa/router');
const topicConfigsController = require('./controllers/topicConfigsController');
const router = new Router();

router.get('/topicConfigs', topicConfigsController.getAll);
router.get('/topicConfigs/:id', topicConfigsController.getById);

module.exports = router;
const Router = require('@koa/router');
const topicsController = require('./controllers/topicsController');
const router = new Router();

router.get('/topics', topicsController.getAll);
router.get('/topics/:id', topicsController.getById);
router.post('/topics', topicsController.create);
router.put('/topics/:id', topicsController.update);
router.delete('/topics/:id', topicsController.delete);

module.exports = router;
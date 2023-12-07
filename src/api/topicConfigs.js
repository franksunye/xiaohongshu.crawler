const Router = require('@koa/router');
const topicConfigsController = require('./controllers/topicConfigsController');
const router = new Router();

/**
 * @swagger
 * /topicConfigs:
 *   get:
 *     description: Returns all topicConfigs
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: topicConfigs
 */
router.get('/topicConfigs', topicConfigsController.getAll);

/**
 * @swagger
 * /topicConfigs/{id}:
 *   get:
 *     description: Returns a single topicConfig
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: TopicConfig's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single topicConfig
 */
router.get('/topicConfigs/:id', topicConfigsController.getById);

module.exports = router;
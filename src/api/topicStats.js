/**
 * @swagger
 * components:
 *   schemas:
 *     TopicStat:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a topic stat.
 *         name:
 *           type: string
 *           description: The name of the topic.
 *         count:
 *           type: integer
 *           description: The count of the topic.
 *       required:
 *         - id
 *         - name
 *         - count
 */

const Router = require('@koa/router');
const topicStatsController = require('./controllers/topicStatsController');
const router = new Router();

/**
 * @swagger
 * /topicStats/{id}:
 *   get:
 *     summary: Retrieve a topic stat by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A topic stat object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicStat'
 */
router.get('/topicStats/:id', topicStatsController.getById);

/**
 * @swagger
 * /topicStats/{id}/update:
 *   put:
 *     summary: Update a topic stat by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopicStat'
 *     responses:
 *       200:
 *         description: The updated topic stat object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopicStat'
 */
router.put('/topicStats/:id/update', topicStatsController.update);


module.exports = router;
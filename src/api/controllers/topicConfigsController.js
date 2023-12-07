const topicConfigService = require('../../services/topicConfigService');
const logger = require('../../utils/logger');

exports.getAll = async (ctx) => {
    logger.info('[topicConfigsController] getAll: Start');
    ctx.body = await topicConfigService.getTopicIds();
    logger.info('[topicConfigsController] getAll: End');
};

exports.getById = async (ctx) => {
    logger.info(`[topicConfigsController] getById: Start, id = ${ctx.params.id}`);
    ctx.body = await topicConfigService.getTopicNameById(ctx.params.id);
    logger.info('[topicConfigsController] getById: End');
};
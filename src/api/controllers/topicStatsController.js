const topicStatsService = require('../../services/topicStatsService');
const logger = require('../../utils/logger'); 

exports.getById = async (ctx) => {
    logger.info(`[topicStatsController] getById: Getting stats for topic with ID: ${ctx.params.id}`);
    ctx.body = await topicStatsService.getTopicStats(ctx.params.id);
    logger.info(`[topicStatsController] getById: Successfully got stats for topic with ID: ${ctx.params.id}`);
};

exports.update = async (ctx) => {
    logger.info(`[topicStatsController] update: Updating stats for topic with ID: ${ctx.params.id}`);
    logger.info(`[topicStatsController] update: Request body is ${JSON.stringify(ctx.request.body)}`);

    const duration = Number(ctx.request.body.duration);
    const newRecordsCount = Number(ctx.request.body.newRecordsCount);
    await topicStatsService.updateTopicStatus(ctx.params.id, duration, newRecordsCount);
    logger.info(`[topicStatsController] update: Successfully updated stats for topic with ID: ${ctx.params.id}`);
    ctx.body = { message: 'Topic updated successfully' };
};
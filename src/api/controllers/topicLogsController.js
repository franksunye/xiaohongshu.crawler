const topicsService = require('../../services/topicLogsService');
const logger = require('../../utils/logger');

exports.getAllLogs = async (ctx) => {
    logger.info('[topicsController] getAllLogs: Start');
    ctx.body = await topicsService.getAllLogs();
    logger.info('[topicsController] getAllLogs: End');
};

exports.getLogById = async (ctx) => {
    logger.info(`[topicsController] getLogById: Start, id = ${ctx.params.id}`);
    ctx.body = await topicsService.getLogById(ctx.params.id);
    logger.info('[topicsController] getLogById: End');
};

exports.createLog = async (ctx) => {
    logger.info(`[topicsController] createLog: Start, body = ${JSON.stringify(ctx.request.body)}`);
    const isAdded = await topicsService.createLog(ctx.request.body);
    logger.info(`[topicsController] createLog: End, isAdded = ${isAdded}`);
    if (isAdded) {
        ctx.status = 201;
        ctx.body = { message: 'Topic log created successfully' };
    } else {
        ctx.status = 200;
        ctx.body = { message: 'Topic log already exists' };
    }
};
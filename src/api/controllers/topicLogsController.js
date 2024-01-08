const topicsService = require('../../services/topicLogsService');
const logger = require('../../utils/logger');

exports.getAllLogs = async (ctx) => {
    logger.info('[topicsController] getAllLogs: Start');
    const sortOrder = ctx.query.sortOrder || 'desc';
    ctx.body = await topicsService.getAllLogs(sortOrder);
    logger.info('[topicsController] getAllLogs: End');
};

exports.getLogById = async (ctx) => {
    logger.info(`[topicsController] getLogById: Start, id = ${ctx.params.id}`);
    const sortOrder = ctx.query.sortOrder || 'desc';
    ctx.body = await topicsService.getLogById(ctx.params.id, sortOrder);
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
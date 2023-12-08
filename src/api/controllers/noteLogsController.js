const noteLogsService = require('../../services/noteLogsService');
const logger = require('../../utils/logger');

exports.getAllLogs = async (ctx) => {
    logger.info('[notesController] getAllLogs: Start');
    ctx.body = await noteLogsService.getAllLogs();
    logger.info('[notesController] getAllLogs: End');
};

exports.getLogById = async (ctx) => {
    logger.info(`[notesController] getLogById: Start, id = ${ctx.params.id}`);
    ctx.body = await noteLogsService.getLogById(ctx.params.id);
    logger.info('[notesController] getLogById: End');
};

exports.createLog = async (ctx) => {
    logger.info(`[notesController] createLog: Start, body = ${JSON.stringify(ctx.request.body)}`);
    const isAdded = await noteLogsService.createLog(ctx.request.body);
    logger.info(`[notesController] createLog: End, isAdded = ${isAdded}`);
    if (isAdded) {
        ctx.status = 201;
        ctx.body = { message: 'Note log created successfully' };
    } else {
        ctx.status = 200;
        ctx.body = { message: 'Note log already exists' };
    }
};
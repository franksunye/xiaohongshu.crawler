const storageService = require('./storageService');
const config = require('../config');
const logger = require('../utils/logger');

exports.getAllLogs = async () => {
    logger.info('[noteLogsService] getAllLogs: Start');
    const logs = await storageService.loadData(config.noteLogCsvFilePath);
    logger.info('[noteLogsService] getAllLogs: End');
    return logs;
};
exports.getLogsByPageAndSort = async (page, pageSize, sortField, sortOrder) => {
    logger.info(`[noteLogsService] getLogsByPageAndSort: Start, page = ${page}, pageSize = ${pageSize}, sortField = ${sortField}, sortOrder = ${sortOrder}`);
    const logs = await storageService.loadDataByPageAndSort(config.noteLogCsvFilePath, Number(page), Number(pageSize), sortField, sortOrder);
    logger.info(`[noteLogsService] getLogsByPageAndSort: End`);
    return logs;
};
exports.getLogById = async (id) => {
    logger.info(`[noteLogsService] getLogById: Start, id = ${id}`);
    const logs = await storageService.loadData(config.noteLogCsvFilePath);
    const matchingLogs = logs.filter(log => log['id'] === id);
    logger.info(`[noteLogsService] getLogById: End, matchingLogs = ${JSON.stringify(matchingLogs)}`);
    return matchingLogs;
};

exports.createLog = async (noteLogs) => {
    logger.debug(`[noteLogsService] createLog: Start, noteLogs = ${JSON.stringify(noteLogs)}`);
    let addedCount = 0;
    for (const noteLog of noteLogs) {
        if (typeof noteLog.likes !== 'string') {
            noteLog.likes = String(noteLog.likes);
        }
        const isAdded = await storageService.writeDataWithDuplicationCheck(config.noteLogCsvFilePath, [noteLog], Object.keys(noteLog), ['id', 'likes']);
        logger.debug(`[noteLogsService] createLog: End, isAdded = ${isAdded}`);
        if (isAdded){
            addedCount++;
        }
    }
    logger.info(`[noteLogsService] createLog: End, addedCount = ${addedCount}`);
};

exports.countLogs = async () => {
    logger.info('[noteLogsService] countLogs: Start');
    const count = await storageService.countRecords(config.noteLogCsvFilePath);
    logger.info(`[noteLogsService] countLogs: End, count = ${count}`);
    return count;
};
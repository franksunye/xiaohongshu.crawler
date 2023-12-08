const storageService = require('./storageService');
const config = require('../config');
const logger = require('../utils/logger');

exports.getAllLogs = async () => {
    logger.info('[topicLogsService] getAllLogs: Start');
    const logs = await storageService.loadData(config.topicLogCsvFilePath);
    logger.info('[topicLogsService] getAllLogs: End');
    return logs;
};

exports.getLogById = async (id) => {
    logger.info(`[topicLogsService] getLogById: Start, id = ${id}`);
    const logs = await storageService.loadData(config.topicLogCsvFilePath);
    const matchingLogs = logs.filter(log => log['topic_id'] === id);
    logger.info(`[topicLogsService] getLogById: End, matchingLogs = ${JSON.stringify(matchingLogs)}`);
    return matchingLogs;
};

exports.createLog = async (topicLog) => {
    logger.info(`[topicLogsService] createLog: Start, topicLog = ${JSON.stringify(topicLog)}`);
    // Convert total_notes_count and view_count to strings if they are not already
    if (typeof topicLog.total_notes_count !== 'string') {
        topicLog.total_notes_count = String(topicLog.total_notes_count);
    }
    if (typeof topicLog.view_count !== 'string') {
        topicLog.view_count = String(topicLog.view_count);
    }
    const isAdded = await storageService.writeDataWithDuplicationCheck(config.topicLogCsvFilePath, [topicLog], Object.keys(topicLog), ['topic_id', 'total_notes_count', 'view_count']);    
    logger.info(`[topicLogsService] createLog: End, isAdded = ${isAdded}`);
    return isAdded;
};
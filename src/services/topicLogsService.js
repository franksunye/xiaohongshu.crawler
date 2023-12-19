const storageService = require('./storageService');
const config = require('../config');
const logger = require('../utils/logger');

exports.getAllLogs = async (sortOrder = 'desc') => {
    logger.info('[topicLogsService] getAllLogs: Start');
    let logs = await storageService.loadData(config.topicLogCsvFilePath);
    logs.sort((a, b) => {
        const dateA = new Date(a.extract_time);
        const dateB = new Date(b.extract_time);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    logger.info('[topicLogsService] getAllLogs: End');
    return logs;
};

exports.getLogById = async (id, sortOrder = 'desc') => {
    logger.info(`[topicLogsService] getLogById: Start, id = ${id}`);
    let logs = await storageService.loadData(config.topicLogCsvFilePath);
    let matchingLogs = logs.filter(log => log['topic_id'] === id);
    matchingLogs.sort((a, b) => {
        const dateA = new Date(a.extract_time);
        const dateB = new Date(b.extract_time);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    logger.info(`[topicLogsService] getLogById: End, matchingLogs = ${JSON.stringify(matchingLogs)}`);
    return matchingLogs;
};

exports.createLog = async (topicLog) => {
    logger.debug(`[topicLogsService] createLog: Start, topicLog = ${JSON.stringify(topicLog)}`);
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
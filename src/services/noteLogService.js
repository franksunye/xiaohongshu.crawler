const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');
const { writeNoteLogToCsv } = require('./csvService');

class NoteLogService {
    constructor() {
        this.logFilePath = config.noteLogCsvFilePath;
        logger.debug(`[NoteLogService] constructor: Initialized with log file path: ${this.logFilePath}`);
    }

    async recordLog(logData) {
        // Check if logData has data and how many
        if (logData && Array.isArray(logData)) {
            logger.info(`[NoteLogService] recordLog: logData has ${logData.length} records`);
        } else {
            logger.info(`[NoteLogService] recordLog: logData is empty or not an array`);
        }
        // logger.debug(`[NoteLogService] recordLog: Recording log data: ${JSON.stringify(logData)}`);
        await writeNoteLogToCsv(logData, this.logFilePath);
        logger.info('[NoteLogService] recordLog: Log data recorded successfully');
    }
}

module.exports = new NoteLogService();
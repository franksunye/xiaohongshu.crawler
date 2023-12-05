// 新的 service: topicLogService.js
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger'); // 引入 logger 工具
const { writeTopicLogToCsv } = require('./csvService');

class TopicLogService {
    constructor() {
        // this.logFilePath = path.join(__dirname, '../topicLog.csv'); // 日志文件路径
        this.logFilePath = config.topicLogCsvFilePath; // 使用 config 中定义的路径
        logger.debug(`[TopicLogService] constructor:Initialized with log file path: ${this.logFilePath}`);
    }

    async recordLog(logData) {
        logger.info(`[TopicLogService] recordLog: Recording log data: ${JSON.stringify(logData)}`);
        await writeTopicLogToCsv(logData, this.logFilePath);
        logger.info('[TopicLogService] recordLog: Log data recorded successfully');
    }
}

module.exports = new TopicLogService();
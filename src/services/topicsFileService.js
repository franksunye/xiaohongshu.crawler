// topicsFileService.js

const fs = require('fs');
const path = require('path');
const config = require('../config'); // 确保路径正确
const logger = require('../utils/logger'); // 引入 logger

function updateTopicStatus(topicId, duration, newRecordsCount) {
    logger.info(`[topicsFileService] updateTopicStatus: Updating topicsFile for topicId: ${topicId}`);

    const updateFn = (record) => {
        if (record['话题ID'] === topicId) {
            record.duration += duration;
            record.newRecordsCount += newRecordsCount;
        }
        return record;
    };
    storageService.updateRecordInCsv(config.topicsCsvFilePath, updateFn);

    logger.info(`[topicsFileService] updateTopicStatus: Updated topicsFile successfully for topicId: ${topicId}`);

}

module.exports = { updateTopicsFile: updateTopicStatus};
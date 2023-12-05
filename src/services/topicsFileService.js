// topicsFileService.js

const fs = require('fs');
const path = require('path');
const config = require('../config'); // 确保路径正确
const logger = require('../utils/logger'); // 引入 logger

function updateTopicsFile(topicId, duration, newRecordsCount) {
    logger.info(`[topicsFileService] updateTopicsFile: Updating topicsFile for topicId: ${topicId}`);

    const filePath = config.topicsCsvFilePath; // 使用 config 中定义的路径
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    const header = lines[0];
    const updatedLines = lines.slice(1).map(line => {
        const parts = line.split(',');
        if (parts[0] === topicId) {
            // 累计爬取时间在第三列，累计爬取次数在第四列
            parts[2] = parseInt(parts[2] || 0) + duration; // 更新累计爬取时间
            parts[3] = parseInt(parts[3] || 0) + 1;        // 更新累计爬取次数
            parts[5] = parseInt(parts[5] || 0) + newRecordsCount; // 更新已保存话题数量
        }
        return parts.join(',');
    });

    fs.writeFileSync(filePath, [header, ...updatedLines].join('\n'));
    logger.info(`[topicsFileService] updateTopicsFile: Updated topicsFile successfully for topicId: ${topicId}`);

}

function readTopicsFile(topicId) {
    logger.info(`[topicsFileService] readTopicsFile: Reading data for topicId: ${topicId} from topicsFile`);

    const filePath = config.topicsCsvFilePath; // 使用 config 中定义的路径
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    const header = lines[0].split(',');
    const topicIdLine = lines.find(line => line.split(',')[0] === topicId);
    logger.info(`[topicsFileService] readTopicsFile: Found data for topicId: ${topicId}`);

    if (!topicIdLine) {
        return null;
        logger.warn(`No data found for topicId: ${topicId}`);
        
    }

    const topicIdData = topicIdLine.split(',');
    const topicIdStats = {};
    header.forEach((key, index) => {
        topicIdStats[key] = topicIdData[index];
    });

    return topicIdStats;
}

function getTopicNameById(topicId) {
    const filePath = config.topicsCsvFilePath; // 使用 config 中定义的路径
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    
    for (const line of lines.slice(1)) {
        const parts = line.split(',');
        if (parts[0] === topicId) {
            return parts[1]; // 返回话题名称
        }
    }

    return null; // 如果没有找到对应的话题ID，返回null
}

function gettopicIds() {
    const filePath = config.topicsCsvFilePath;
    logger.info(`[topicsFileService] gettopicIds: Reading Topic IDs from file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    const ids = lines.slice(1).map(line => line.split(',')[0]).filter(id => id);
    logger.info(`[topicsFileService] gettopicIds: Extracted ${ids.length} Topic IDs from file.`);
    logger.info(`[topicsFileService] gettopicIds: Topic IDs: ${ids.join(', ')}`);
    return ids;
}

module.exports = { updateTopicsFile, readTopicsFile, getTopicNameById, gettopicIds };
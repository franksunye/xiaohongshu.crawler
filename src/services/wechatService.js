// wechatService.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('../config');
const logger = require('../utils/logger'); // 导入 logger
const TopicStatsService = require('./topicStatsService');
const NoteLogService = require('./noteLogsService');

const { formatDuration } = require('../utils/utils');

async function sendWechatNotification(message) {

    await axios.post(config.WeChatBotURL, {
        msgtype: 'text',
        text: {
            content: message
            // mentioned_mobile_list: ["18600372156"]
        }
    });
}

async function sendFileMessage(mediaId) {

    const data = {
        msgtype: 'file',
        file: {
            media_id: mediaId,
        },
    };

    try {
        const response = await axios.post(config.WeChatBotURL, data);
        if (response.data.errcode !== 0) {
            throw new Error(`Error sending file message: ${response.data.errmsg}`);
        }
    } catch (error) {
        logger.error(`[wechatService] sendFileMessage: Error uploading file for WeChat bot: ${error.message}`);
    }
}

async function uploadFileForWechatBot(filePath, fileName) {

    const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${config.WeChatBotKey}&type=file`;

    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    
    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath), {
        filename: fileName,
        knownLength: fileSizeInBytes,

    });

    logger.info(`[wechatService] uploadFileForWechatBot: Uploading file ${fileName} to WeChat Work`);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        if (response.data.errcode !== 0) {
            throw new Error(`Error uploading file: ${response.data.errmsg}`);
        }
        return response.data.media_id;
    } catch (error) {
        logger.error(`[wechatService] uploadFileForWechatBot: Error uploading file for WeChat bot: ${error.message}`);
        return null;
    }
}

function generateFileName(fileType) {
    const now = new Date();
    const dateString = now.getFullYear() + "-" +
                       String(now.getMonth() + 1).padStart(2, '0') + "-" +
                       String(now.getDate()).padStart(2, '0') + "_" +
                       String(now.getHours()).padStart(2, '0') + "-" +
                       String(now.getMinutes()).padStart(2, '0');

    return `${fileType}_${dateString}.csv`;
}

async function sendNotification(topicId, duration, newRecordsCount, requestCount) {
    logger.info(`[wechatService] sendNotification: Sending notification for topicId: ${topicId}`);
    TopicStatsService.updateTopicStatus(topicId, duration, newRecordsCount);
    // const topicIdStats = readTopicsFile(topicId);
    const topicIdStats = await TopicStatsService.getTopicStats(topicId);
    const totalRecords = await NoteLogService.countLogs();
    const message = `本次秘密任务是爬取的小红书话题 #${topicIdStats['话题名称']} 的最新内容\n` +
        `本次耗时${formatDuration(duration)}（我累计已经为你服务了${formatDuration(topicIdStats['累计爬取时间'])}）\n` +
        `我这次爬呀爬了${requestCount}次（我累计已经爬呀爬了${topicIdStats['累计爬取次数']}次）\n` +
        `你的小仓库新增了${newRecordsCount}条记录（总共有${totalRecords}条记录）`;
    await sendWechatNotification(message);
}

async function sendFile(filePath, fileType) {
    const fileName = generateFileName(fileType);
    logger.info(`[wechatService] sendFile: Generated file name: ${fileName}`);
    const mediaId = await uploadFileForWechatBot(filePath, fileName);
    if (mediaId) {
        logger.info(`[wechatService] sendFile: File uploaded successfully, media_id: ${mediaId}`);
        await sendFileMessage(mediaId);
        logger.info('[wechatService] sendFile: FileMessage sent');
    } else {
        logger.error('[wechatService] sendFile: Failed to upload file, mediaId not received');
    }
}

module.exports = { 
    sendNotification,
    sendFile
};
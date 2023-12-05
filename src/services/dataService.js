// dataService.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger'); // 确保路径正确
const { writeDataToCsv } = require('./csvService');


// 从 API 获取数据
async function fetchData(topicId, cursor, sortType) {
    try {
        logger.info(`[dataService] fetchData: Fetching data for topicId: ${topicId} with cursor: ${cursor} using sortType: ${sortType}`);

        const randomUserAgent = config.headers.userAgents[Math.floor(Math.random() * config.headers.userAgents.length)];
        logger.info(`[dataService] fetchData: Using User-Agent: ${randomUserAgent}`);

        const response = await axios.get(config.baseUrl, {
            headers: {
                ...config.headers,
                'User-Agent': randomUserAgent
            },
            params: {
                page_size: config.pageSize,
                sort: sortType,
                page_id: topicId,
                cursor: cursor
            }
        });
        // 获取 total_note_count 的值
        const totalNoteCount = response.data.data.total_note_count || 0;

        // 响应数据中包含一个名为 'notes' 的数组
        const notesCount = response.data.data && response.data.data.notes ? response.data.data.notes.length : 0;
        logger.info(`[dataService] fetchData: Data fetched successfully for topicId: ${topicId}`);
        logger.info(`[dataService] fetchData: Total note count: ${totalNoteCount}`);
        logger.info(`[dataService] fetchData: Number of notes fetched: ${notesCount}`);

        return response.data;
    } catch (error) {
        logger.error(`[dataService] fetchData: Error fetching data for topicId: ${topicId} - ${error.message}`);
        throw error;
    }
}

async function fetchTopicViews(topicId) {
    const url = `https://www.xiaohongshu.com/page/topics/${topicId}`;
    logger.info(`[dataService] fetchTopicViews: Fetching views for topic ID ${topicId}`);

    try {
        const response = await axios.get(url);
        logger.info(`[dataService] fetchTopicViews: Received response for ${url}`);
        
        const html = response.data;
        const $ = cheerio.load(html);

        // 解析 HTML 页面，提取浏览量和单位
        const viewText = $('.summary .meta span').first().text().trim(); // 例如: "1065.3"
        const unitText = $('.summary .meta').first().text().trim(); // 例如: "1065.3万浏览"

        // 从 unitText 中提取单位
        const viewCountUnit = unitText.replace(viewText, '').replace('浏览', '').trim();

        logger.info(`[dataService] fetchTopicViews: Extracted view count ${viewText} and unit ${viewCountUnit} for topic ID ${topicId}`);

        return {
            viewCount: parseFloat(viewText),
            viewCountUnit: viewCountUnit // 提取 "万" 或类似单位
        };
    } catch (error) {
        logger.error(`[dataService] fetchTopicViews: Error fetching topic views for ${topicId}: ${error}`);
        return {
            viewCount: 0,
            viewCountUnit: ''
        };
    }
}

module.exports = { fetchData, fetchTopicViews, writeDataToCsv };

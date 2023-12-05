// csvService.js
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv'); // 引入fast-csv
const csvWriter = require('csv-writer').createObjectCsvWriter;

const config = require('../config'); // 确保路径正确
const logger = require('../utils/logger'); // 确保路径正确

function countCsvRecords() {
    const filePath = config.notelogCsvFilePath; // 使用 config 中定义的路径
    if (!fs.existsSync(filePath)) {
        return { totalRecords: 0, newRecords: 0 };
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    const dataLines = lines.filter(line => line.trim().length > 0 && !line.startsWith('话题ID'));
    const totalRecords = dataLines.length - 1; // 减去标题行

    return { totalRecords };
}

async function readCsvFile(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', row => data.push(row))
            .on('end', () => resolve(data));
    });
}

// 将数据写入 CSV 文件
async function writeNoteLogToCsv(data, filePath) {

    logger.info(`[csvService] writeDataToCsv: Checking for duplicates before writing to CSV`);

    const existingData = fs.existsSync(filePath)
        ? await readCsvFile(filePath)
        : [];

    logger.info(`[csvService] writeDataToCsv: Existing data count: ${existingData.length}`);

    // const newData = data.filter(newRecord =>
    //     !existingData.some(existingRecord => existingRecord.id === newRecord.id)
    // );
    const newData = data.filter(newRecord =>
        !existingData.some(existingRecord =>
            existingRecord.id === newRecord.id && Number(existingRecord.likes) === Number(newRecord.likes))
    );
    // console.log(typeof existingData[0].likes, typeof data[0].likes);

    logger.info(`[csvService] writeDataToCsv: New data count after removing duplicates: ${newData.length}`);

    if (newData.length === 0) {
        logger.info('[csvService] writeDataToCsv: No new records to write to CSV');
        return;
    }

    logger.info(`[csvService] writeDataToCsv: Preparing to write ${newData.length} records to CSV`);
    // 在此处添加日志以检查数据结构
    // logger.info(`Data to write: ${JSON.stringify(newData, null, 2)}`);

    logger.info(`[csvService] writeDataToCsv: Preparing to write data to CSV file: ${filePath}`);
    const csvwriter = csvWriter({
        path: filePath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'likes', title: 'Likes' },
            { id: 'title', title: 'Title' },
            { id: 'desc', title: 'Description' },
            { id: 'nickname', title: 'Nickname' },
            { id: 'images', title: 'Images' },
            { id: 'userid', title: 'UserID' },
            { id: 'image_count', title: 'Image Count' },
            { id: 'create_time', title: 'Create Time' },
            { id: 'topic_name', title: 'Topic Name' },
            { id: 'topic_id', title: 'Topic ID' },
            { id: 'type', title: 'Type' },
            { id: 'user_red_official_verify_type', title: 'User Red Official Verify Type' },
            { id: 'images_list_url', title: 'Images List URL' },
            { id: 'video_id', title: 'Video ID' },
            { id: 'video_info_url', title: 'Video Info URL' },
            { id: 'video_info_duration', title: 'Video Info Duration' },
            { id: 'video_info_played_count', title: 'Video Info Played Count' },
            { id: 'video_info_first_frame', title: 'Video Info First Frame' },
            { id: 'video_info_thumbnail', title: 'Video Info Thumbnail' },
            { id: 'extract_time', title: 'Extract Time' }
        ],
        append: true
    });

    try {
        await csvwriter.writeRecords(newData);
        logger.info('[csvService] writeDataToCsv: Data written to CSV successfully');
    } catch (error) {
        logger.error(`[csvService] writeDataToCsv: Error writing data to CSV: ${error.message}`);
    }
}

async function writeTopicLogToCsv(logData, filePath) {
    logger.info(`[csvService] writeLogToCsv: Preparing to write log data to CSV file: ${filePath}`);
    // 检查重复记录
    const isDuplicate = await isDuplicateLog(logData, filePath);

    logger.debug(`[csvService] writeLogToCsv: Log entry is duplicate: ${isDuplicate}`);

    // 如果不是重复记录，则写入日志
    if (!isDuplicate) {
        const writer = csvWriter({
            path: filePath,
            header: [
                { id: 'topic_id', title: 'TOPIC_ID' },
                { id: 'topic_name', title: 'TOPIC_NAME' },
                { id: 'total_notes_count', title: 'TOTAL_NOTES_COUNT' },
                { id: 'view_count', title: 'VIEW_COUNT' },
                { id: 'view_count_unit', title: 'VIEW_COUNT_UNIT' },
                { id: 'local_saved_notes_count', title: 'LOCAL_SAVED_NOTES_COUNT' },
                { id: 'extract_time', title: 'EXTRACT_TIME' }
            ],
            append: true
        });

        await writer.writeRecords([logData]);
        logger.info('[csvService] writeLogToCsv: Log data recorded successfully');
    } else {
        logger.info('[csvService] writeLogToCsv: Skipped duplicate log entry');
    }
}

async function isDuplicateLog(newLog, filePath) {
    if (!fs.existsSync(filePath)) {
        logger.debug('[csvService] isDuplicateLog: Log file does not exist. Creating new log entry.');
        return false; // 如果文件不存在，肯定不是重复
    }

    const existingLogs = await readCsvFile(filePath);
    const isDuplicate = existingLogs.some(log =>
        log.topic_id === newLog.topic_id 
        && log.total_notes_count === newLog.total_notes_count.toString()
        && log.view_count === newLog.view_count.toString()
    );
    logger.debug(`[csvService] isDuplicateLog: Log entry is duplicate: ${isDuplicate}`);
    return isDuplicate;
}

module.exports = { countCsvRecords, readCsvFile, writeTopicLogToCsv, writeNoteLogToCsv };

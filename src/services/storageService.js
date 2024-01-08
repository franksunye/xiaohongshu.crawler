const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const logger = require('../utils/logger');

exports.saveData = async (filePath, data, fieldNames, append = true) => {
    const writer = csvWriter({
        path: filePath,
        header: fieldNames.map(name => ({ id: name, title: name })),
        append: append
    });

    try {
        await writer.writeRecords(data);
        logger.info(`[storageService] saveData: Data written to CSV successfully. Total records saved: ${data.length}`);
    } catch (error) {
        logger.error(`[storageService] saveData: Error writing data to CSV: ${error.message}`);
    }
};

exports.loadData = async (filePath) => {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', row => data.push(row))
            .on('end', () => resolve(data));
    });
};

exports.writeDataWithDuplicationCheck = async (filePath, newData, fieldNames, uniqueFields) => {
    // logger.info(`[storageService] writeDataWithDuplicationCheck: Start, filePath = ${filePath}, newData = ${JSON.stringify(newData)}, uniqueFields = ${JSON.stringify(uniqueFields)}`);
    const existingData = fs.existsSync(filePath)
        ? await this.loadData(filePath)
        : [];
    // logger.info(`[storageService] writeDataWithDuplicationCheck: Loaded existing data, existingData = ${JSON.stringify(existingData)}`);

    const uniqueData = newData.filter(newRecord =>
        !existingData.some(existingRecord =>
            uniqueFields.every(field => existingRecord[field] === newRecord[field]))
    );
    logger.debug(`[storageService] writeDataWithDuplicationCheck: Filtered unique data, uniqueData = ${JSON.stringify(uniqueData)}`);

    if (uniqueData.length > 0) {
        await this.saveData(filePath, uniqueData, fieldNames, true);
        logger.info('[storageService] writeDataWithDuplicationCheck: New data was added');
        return true;
    } else {
        logger.info('[storageService] writeDataWithDuplicationCheck: No new data was added');
        return false;
    }
};

exports.updateRecordInCsv = async (filePath, updateFn, fieldNames) => {
    const data = await this.loadData(filePath);
    const updatedData = data.map(updateFn);
    await this.saveData(filePath, updatedData, fieldNames, false);
};

exports.countRecords = async (filePath) => {
    const records = await this.loadData(filePath);
    return records.length - 1; // Subtract one for the header row
};
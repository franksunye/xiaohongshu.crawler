const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

exports.saveData = async (filePath, data, headers) => {
    const writer = csvWriter({
        path: filePath,
        header: headers,
        append: true
    });

    try {
        await writer.writeRecords(data);
        console.log('[storageService] saveData: Data written to CSV successfully');
    } catch (error) {
        console.error(`[storageService] saveData: Error writing data to CSV: ${error.message}`);
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
const fs = require('fs');
const csvParser = require('csv-parser');
const { checkHeaders, batchGenerator } = require('./csvHelper');
const { insertData } = require('../dataAccess/dataAccess');

const expectedHeaders = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude', 'time_zone'];
const batchSize = 500;

async function processCSV(filePath) {
  const stream = fs.createReadStream(filePath).pipe(csvParser());
  const errors = [];

  let headersChecked = false;
  for await (const batch of batchGenerator(stream, batchSize)) {
    if (!headersChecked) {
      const headers = Object.keys(batch[0]);
      if (!checkHeaders(headers)) {
        fs.unlinkSync(filePath);
        const expectedHeadersMessage = `Expected headers: ${expectedHeaders.join(', ')}`;
        return { message: 'Incorrect headers in CSV file', errors: [expectedHeadersMessage] };
      }
      headersChecked = true;
    }

    const error = await insertData(batch);
    if (error) {
      console.log('error occurred while processing batch')
      if (error.code === '23505') {
        // Handle duplicate record violation error
        batch.forEach((row, index) => {
          errors.push({ row: index + 1, error: 'Duplicate record' });
        });
      } else {
        batch.forEach((row, index) => {
          errors.push({ row: index + 1, error });
        });
      }
    }
  }

  

  if (errors.length === 0) {
    fs.unlinkSync(filePath);
    return { message: 'CSV file uploaded successfully', errors };
  } else {
    fs.unlinkSync(filePath);
    return { message: 'Errors encountered during CSV upload', errors };
  }
}

module.exports = { processCSV };

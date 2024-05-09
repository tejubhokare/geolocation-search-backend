const fs = require('fs');
const csvParser = require('csv-parser');

const expectedHeaders = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude', 'time_zone'];

function checkHeaders(headers) {
  const expectedHeaders = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude', 'time_zone'];
  return headers.every(header => expectedHeaders.includes(header)) && headers.length === expectedHeaders.length;
}

async function* batchGenerator(stream, batchSize) {
  let batch = [];
  for await (const row of stream) {
    batch.push(row);
    if (batch.length === batchSize) {
      yield batch;
      batch = [];
    }
  }
  if (batch.length > 0) {
    yield batch;
  }
}

module.exports = { checkHeaders, batchGenerator };


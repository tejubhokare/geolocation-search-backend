const { processCSV } = require('../utility/csvProcessor');
const fs = require('fs');
const path = require('path');

beforeEach(() => {
  const dataFolder = path.join(__dirname, 'data');
  const testFolder = path.join(__dirname);

  fs.readdirSync(dataFolder).forEach((file) => {
    const filePath = path.join(dataFolder, file);
    const testFilePath = path.join(testFolder, file);
    fs.copyFileSync(filePath, testFilePath);
  });
});


describe('processCSV', () => {
  it('returns success message for valid CSV file', async () => {
    const filePath = path.join(__dirname, 'valid.csv');
    const result = await processCSV(filePath);
    expect(result.message).toBe('CSV file uploaded successfully');
    expect(result.errors).toEqual([]);
  });

  it('returns error message for invalid CSV file', async () => {
    const filePath = path.join(__dirname, 'invalid.csv');
    const result = await processCSV(filePath);
    expect(result.message).toBe('Incorrect headers in CSV file');
    expect(result.errors).toEqual(['Expected headers: street, city, zip_code, county, country, latitude, longitude, time_zone']);
  });

});
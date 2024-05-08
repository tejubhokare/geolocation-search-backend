const fs = require('fs');
const csvParser = require('csv-parser');
const { checkHeaders, batchGenerator } = require('../utility/csvHelper');

jest.mock('fs');
jest.mock('csv-parser');

describe('csvHelper utility functions', () => {
  describe('checkHeaders', () => {
    it('should return true when all expected headers are present', () => {
      const headers = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude', 'time_zone'];
      const result = checkHeaders(headers);
      expect(result).toBe(true);
    });
  });

});

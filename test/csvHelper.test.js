const { batchGenerator, checkHeaders } = require('../utility/csvHelper');

describe('checkHeaders', () => {
  it('returns true for valid headers', () => {
    const headers = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude', 'time_zone'];
    expect(checkHeaders(headers)).toBe(true);
  });

  it('returns false for invalid headers', () => {
    const headers = ['invalid', 'headers'];
    expect(checkHeaders(headers)).toBe(false);
  });

  it('returns false for missing headers', () => {
    const headers = ['street', 'city', 'zip_code', 'county', 'country', 'latitude', 'longitude']; // missing time_zone
    expect(checkHeaders(headers)).toBe(false);
  });
});

describe('batchGenerator', () => {
  const csvData = [
    {
      street: '1275 Stroman Turnpike',
      city: 'New Ansley',
      zip_code: '75645',
      county: 'Worcestershire',
      country: 'Gabon',
      latitude: '-15.739',
      longitude: '-21.276',
      time_zone: 'Africa/Cairo',
    },
    {
      street: '685 Quitzon Green',
      city: 'West Brendonville',
      zip_code: '78855-2795',
      county: 'Isle of Wight',
      country: 'Cyprus',
      latitude: '-64.756',
      longitude: '53.22',
      time_zone: 'Africa/Cairo',
    },
    {
      street: '1432 Cronin Shoal',
      city: 'Bellingham',
      zip_code: '14556-1219',
      county: 'Hampshire',
      country: 'New Caledonia',
      latitude: '16.558',
      longitude: '-45.451',
      time_zone: 'Africa/Cairo',
    },
  ];

  it('generates batches of correct size', async () => {
    const batchSize = 2;
    const batches = [];
    for await (const batch of batchGenerator(csvData, batchSize)) {
      batches.push(batch);
    }
    expect(batches).toEqual([
      [
        {
          street: '1275 Stroman Turnpike',
          city: 'New Ansley',
          zip_code: '75645',
          county: 'Worcestershire',
          country: 'Gabon',
          latitude: '-15.739',
          longitude: '-21.276',
          time_zone: 'Africa/Cairo',
        },
        {
          street: '685 Quitzon Green',
          city: 'West Brendonville',
          zip_code: '78855-2795',
          county: 'Isle of Wight',
          country: 'Cyprus',
          latitude: '-64.756',
          longitude: '53.22',
          time_zone: 'Africa/Cairo',
        },
      ],
      [
        {
          street: '1432 Cronin Shoal',
          city: 'Bellingham',
          zip_code: '14556-1219',
          county: 'Hampshire',
          country: 'New Caledonia',
          latitude: '16.558',
          longitude: '-45.451',
          time_zone: 'Africa/Cairo',
        },
      ],
    ]);
  });
});
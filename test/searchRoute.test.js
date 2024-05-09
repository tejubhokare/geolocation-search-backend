const express = require('express');
const router = require('../routes/search'); // Ensure this path is correct 
const { searchLocations } = require('../dataAccess/dataAccess');
const { calculateScore } = require('../utility/searchScore'); 
const request = require('supertest');

jest.mock('../dataAccess/dataAccess'); 
jest.mock('../utility/searchScore');

describe('Search Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(router);
  });

  it('should return locations based on search term', async () => {
    const searchTerm = 'coffee shop';
    const latitude = 43.651070; 
    const longitude = -79.347015;
    const mockLocations = [
      { street: '123 Main St', city: 'Toronto', zip_code: 'M5G 1C3' },
      { street: '456 Elm St', city: 'Ottawa', zip_code: 'K1P 5J1', },
    ];

    // Mock the behavior of 'searchLocations'
    searchLocations.mockResolvedValue({ locations: mockLocations, error: null });

    // Mock the behavior of 'calculateScore'
    calculateScore.mockReturnValue(0.01); 

    const response = await request(app)
      .get('/search')
      .query({ q: searchTerm, latitude, longitude }); 

    expect(searchLocations).toHaveBeenCalledWith('coffee & shop:*'); 
    expect(response.statusCode).toBe(200); 
    expect(response.body.suggestions).toEqual(expect.any(Array)); 
    // More specific assertion with the calculated score
    expect(response.body.suggestions).toEqual([
        { street: '123 Main St', city: 'Toronto', zip_code: 'M5G 1C3','score': 0.01 },
        { street: '456 Elm St', city: 'Ottawa', zip_code: 'K1P 5J1','score': 0.01 },
    ]);
  });
});

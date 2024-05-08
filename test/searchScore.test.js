const { calculateDistance, calculateDistanceScore, calculateTextMatchScore, calculateScore } = require('../utility/searchScore');

describe('calculateDistanceScore', () => {
    test('returns score based on distance between location and user coordinates', () => {
        // Test data
        const location = { latitude: 52.5200, longitude: 13.4050 };
        const userLatitude = 51.5074;
        const userLongitude = -0.1278;

        // Calculate distance score
        const score = calculateDistanceScore(location, userLatitude, userLongitude);

        // Check if score is within valid range (0 to 1)
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });

    test('returns 0 if any input is not a number', () => {
        // Test data
        const location = { latitude: 52.5200, longitude: 'invalid' }; // Invalid longitude
        const userLatitude = 51.5074;
        const userLongitude = -0.1278;

        // Calculate distance score
        const score = calculateDistanceScore(location, userLatitude, userLongitude);

        // Check if score is 0
        expect(score).toBe(0);
    });
});

describe('calculateTextMatchScore', () => {
    test('returns score based on similarity between location information and search term', () => {
        // Test data
        const location = { street: '123 Main St', city: 'Anytown', county: 'Anycounty', country: 'Anyland' };
        const searchTerm = 'Main St';

        // Calculate text match score
        const score = calculateTextMatchScore(location, searchTerm);

        // Check if score is within valid range (0 to 1)
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });
});

describe('calculateScore', () => {
    test('returns relevance score for a location', () => {
        // Test data
        const location = { latitude: 52.5200, longitude: 13.4050, street: '123 Main St', city: 'Anytown', county: 'Anycounty', country: 'Anyland' };
        const userLatitude = 51.5074;
        const userLongitude = -0.1278;
        const searchTerm = 'Main St';

        // Calculate relevance score
        const score = calculateScore(location, userLatitude, userLongitude, searchTerm);

        // Check if score is within valid range (0 to 1)
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });
});

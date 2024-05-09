const express = require('express');
const router = express.Router();
const { searchLocations } = require('../dataAccess/dataAccess');
const { calculateScore } = require('../utility/searchScore');

router.get('/search', async (req, res) => {
    try {
        const { q: searchTerm, latitude, longitude } = req.query;

        // Split the search term into keywords
        const keywords = searchTerm.split(' ');
        // Build the query with '&' between keywords
        const queryTerm = keywords.join(' & ') + ':*'; // Add ':*' for prefix matching

        const { locations, error } = await searchLocations(queryTerm);

        if (error) {
            console.error('Error:', error.message);
            return res.status(500).json({ error: 'An error occurred while searching for locations' });
        }

        // Calculate relevance score for each location
        const scoredResults = locations.map(location => ({
            street: location.street,
            city: location.city,
            zip_code: location.zip_code,
            county: location.county,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            time_zone: location.time_zone,
            score: calculateScore(location, latitude, longitude, searchTerm)
        }));

        // Sort results by score in descending order
        scoredResults.sort((a, b) => b.score - a.score);

        // Return all suggestions
        res.json({
            suggestions: scoredResults
        });
    } catch (error) {
        console.error('Error occurred during search:', error.message);
        res.status(500).json({ error: 'An error occurred during the search process' });
    }
});

module.exports = router;
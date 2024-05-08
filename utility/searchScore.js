const levenshtein = require('fast-levenshtein');

// Calculates a relevance score for a location based on its distance from the user's coordinates and how well it matches the search term.
function calculateScore(location, userLatitude, userLongitude, searchTerm) {
    const distanceMatchScore = calculateDistanceScore(location, userLatitude, userLongitude);
    const textMatchScore = calculateTextMatchScore(location, searchTerm);

    // Normalize the scores
    const maxDistanceMatchScore = 1; // Assuming distanceMatchScore is already normalized
    const maxTextMatchScore = 1; // Assuming textMatchScore is already normalized
    const normalizedDistanceMatchScore = distanceMatchScore / maxDistanceMatchScore;
    const normalizedTextMatchScore = textMatchScore / maxTextMatchScore;

    // Combine scores with weights
    const normalizedScore = 0.9 * normalizedDistanceMatchScore + 0.1 * normalizedTextMatchScore;

    // Round the score to two decimal places
    const roundedScore = parseFloat(normalizedScore.toFixed(2));

    return roundedScore;
}

// Calculates a score based on the distance between a location and the user's coordinates.
function calculateDistanceScore(location, userLatitude, userLongitude) {

    //input validation
    if (isNaN(location.latitude) || isNaN(location.longitude) || isNaN(userLatitude) || isNaN(userLongitude)) {
        return 0; 
    }

    // Calculate distance between location and user coordinates
    const distance = calculateDistance(location.latitude, location.longitude, userLatitude, userLongitude);
    const maxDistance = 1000; 
    let score = 1 - (distance / maxDistance);
    score = Math.max(0, Math.min(1, score));

    // Limit score to two decimal places
    score = parseFloat(score.toFixed(2));

    console.log('distance score')
    console.log(score)

    return score;
}

//Calculates a score based on how well the location matches the search term.
function calculateTextMatchScore(location, searchTerm) {
    const searchableText = (location.street + ' ' + location.city + ' ' + location.county + ' ' + location.country).toLowerCase(); 
    const searchTermLower = searchTerm.toLowerCase();
  
    const maxDistance = Math.max(searchTermLower.length, searchableText.length);  // Consider the maximum length of search term or searchable text
    const distance = levenshtein.get(searchableText, searchTermLower);
  
    // Ensure non-negative score
    let score = 1 - (distance / maxDistance); 

    // Ensure score is between 0 and 1
    score = Math.max(0, Math.min(1, score));

    // Limit score to two decimal places
    score = parseFloat(score.toFixed(2));

    return score;
}



// Function to calculate distance between two sets of latitude and longitude coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = { calculateDistance, calculateDistanceScore, calculateTextMatchScore, calculateScore };
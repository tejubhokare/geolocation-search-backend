const supabase = require('../config/supabaseClient');
const config = require('../config/config');

async function searchLocations(queryTerm) {
    const { data: locations, error } = await supabase
        .from(config.LOCATIONS_TABLE)
        .select('*')
        .textSearch('complete_address', queryTerm);

    return { locations, error };
}

async function insertData(batch) {
  try {
    await supabase.from(config.LOCATIONS_TABLE).insert(batch);
    return null; // Indicate success
  } catch (error) {
    console.log(error)
    return error.message; // Return detailed error message
  }
}

module.exports = { searchLocations, insertData };

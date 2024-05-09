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

  const { data, error } = await supabase.from(config.LOCATIONS_TABLE).upsert(batch, { onConflict: 'street, city, zip_code, county, country' }).select('*');
   if (error) {
    console.log(error)
    return error.message; // Return detailed error message
   } else {
    return null
   }
  
}

module.exports = { searchLocations, insertData };

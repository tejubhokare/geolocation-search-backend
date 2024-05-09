# Geolocation Search Backend

## Brief Description

Node.js/Express backend solution for a coding challenge, featuring geolocation-based search, CSV data migration to a Supabase database, and a RESTful API.

## Prerequisites

* Node.js ([https://nodejs.org/](https://nodejs.org/))  This project is built using Node 18 version.

## Environment Setup

1. **Clone:** Clone this repository.

2. **Install Dependencies:** Navigate to the project directory and run:
   ```bash
   npm install
3. **.env File:** Create a .env file in the root directory. Add the following variables, replacing placeholders with your actual Supabase credentials. For testing purpose I will provide my .env file with my supabase instance details.
```dotenv
SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
SUPABASE_API_KEY=<YOUR_SUPABASE_API_KEY>
PORT=3000  # Optional - Adjust port if needed
```

## Start the Development Server

```bash
npm start
```

## API Endpoints

- `/api/upload`
  - Method: POST
  - Purpose: Uploads a CSV file and loads its data into your Supabase database.
  - Expects: A `multipart/form-data` body containing a file with the key 'csv'.

- `/api/search`
  - Method: GET
  - Parameters:
    - `q`: Search query string
    - `latitude`: User's latitude
    - `longitude`: User's longitude
  - Response: JSON array of search results with relevance scores

## Testing

### Running Tests

```bash
npm test
```
Use code with caution.

## Notes

### Database Schema

The backend utilizes a PostgreSQL database (Supabase)  with the following schema for the `locations` table:

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    street TEXT,
    city TEXT,
    zip_code TEXT,
    county TEXT,
    country TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    time_zone TEXT
);
```

### Search Optimization

To enhance search performance across multiple columns, a SQL function `complete_address` has been implemented in Supabase. This function concatenates relevant address fields for efficient querying.

```sql
CREATE FUNCTION complete_address(locations) RETURNS text AS $$
    SELECT $1.street || ' ' || $1.city || ' ' || $1.zip_code || ' ' || $1.county || ' ' || $1.country;
$$ LANGUAGE SQL IMMUTABLE;
```

### Unique Constraint

To prevent duplicate entries, a unique constraint has been applied to the `locations` table based on specific address details.

```sql
ALTER TABLE locations
ADD CONSTRAINT unique_location
UNIQUE (street, city, zip_code, county, country);
```
## API Documentation

### `/api/search`

#### Description

This endpoint allows users to perform a location-based search. If the user grants permission for their location, the relevance score will be calculated based on both the location match and text match. If the user denies permission for their location, the search will be conducted solely based on the provided query.

#### Request

- **Method:** GET
- **URL:** `http://localhost:3001/api/search`
- **Query Parameters:**
  - `q` (required): User's query
  - `latitude` (optional): Latitude of the user's location
  - `longitude` (optional): Longitude of the user's location

#### Example Request

```http
GET /api/search?q=Canada London&latitude=43.7846016&longitude=-79.4165248
```

#### Response

- **Content Type:** application/json
- **Body:** A JSON object containing search results, including suggestions and their relevance scores.

#### Example Response

```json
{
    "suggestions": [
        {
            "street": "952 Dameon Mountain",
            "city": "East Filibertofurt",
            "zip_code": "64740-2009",
            "county": "Greater London",
            "country": "Canada",
            "latitude": -81.517,
            "longitude": -50.035,
            "time_zone": "Europe/Bratislava",
            "score": 0.92
        },
        {
            "street": "695 Elian Road",
            "city": "Lake Brianne",
            "zip_code": "82982",
            "county": "City of London",
            "country": "Canada",
            "latitude": -43.545,
            "longitude": -87.999,
            "time_zone": "Europe/Riga",
            "score": 0.02
        }
    ]
}
```

### `/api/upload`

#### Description

This endpoint allows users to upload CSV files.

#### Request

- **Method:** POST
- **URL:** `http://localhost:3001/api/upload`
- **Request Body:** Form data with a key `csv` and the CSV file as the value.

#### Example Request

```http
POST /api/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="csv"; filename="example.csv"
Content-Type: text/csv

[CSV file content]
----WebKitFormBoundary7MA4YWxkTrZu0gW--
```

#### Response

- **Content Type:** application/json
- **Body:** A JSON object confirming the successful upload.

#### Example Response

```json
{
  "message": "File uploaded successfully."
}
```

```json
{
    "message": "Incorrect headers in CSV file",
    "errors": [
        "Expected headers: street, city, zip_code, county, country, latitude, longitude, time_zone"
    ]
}
```







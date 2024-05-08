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
3. **.env File:** Create a .env file in the root directory. Add the following variables, replacing placeholders with your actual Supabase credentials:
```bash
SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
SUPABASE_API_KEY=<YOUR_SUPABASE_API_KEY>
PORT=3000  # Optional - Adjust port if needed

## Start the Development Server

```bash
npm start
```
Use code with caution.

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





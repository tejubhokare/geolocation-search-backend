const express = require('express');
const uploadRoute = require('./routes/upload');
const searchRoute = require('./routes/search');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use file upload route
app.use('/api', uploadRoute);

// Use search route
app.use('/api', searchRoute); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const { insertData } = require('../dataAccess/dataAccess');
const { checkHeaders, batchGenerator } = require('../utility/csvHelper');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csv'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = fs.createReadStream(file.path).pipe(csvParser());
  const batchSize = 500;
  const errors = []; // Array to store errors

  stream.on('headers', (headers) => {
    if (!checkHeaders(headers)) {
      // Handle header mismatch
      console.error('Error: Incorrect headers in CSV file');
      fs.unlinkSync(file.path); // Delete file to prevent potential issues
      return res.status(400).json({ error: 'Incorrect headers in CSV file' });
    }
  });

  for await (const batch of batchGenerator(stream, batchSize)) {
    const error = await insertData(batch);
    console.log('error while inserting batch')
    console.log(error)
    if (error) {
      batch.forEach((row, index) => {
        errors.push({ row: index + 1, error });  
      });
    }
  }

  fs.unlinkSync(file.path);

  if (errors.length === 0) {
    res.status(200).json({ message: 'CSV file uploaded successfully' });
  } else {
    res.status(400).json({ 
      message: 'Errors encountered during CSV upload', 
      errors 
    });
  }
});

module.exports = router;

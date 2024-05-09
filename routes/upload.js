const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { processCSV } = require('../utility/csvProcessor');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csv'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await processCSV(file.path);
    if (result.errors.length === 0) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message, errors: result.errors });
    }
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const STREAM_SECRET = 'ka67xpvmz46vz9';

router.post('/generate-token', (req, res) => {
  const { user_id } = req.body;
  
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  
  const token = jwt.sign({ user_id }, STREAM_SECRET, { algorithm: 'HS256' });
  
  res.json({ token });
});

module.exports = router;
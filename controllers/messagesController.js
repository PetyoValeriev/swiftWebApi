const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const { pool } = require('../db');



async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;
    await pool.query('DELETE FROM messages WHERE id = ?', [messageId]);
    logger.info(`Message with ID ${messageId} deleted`);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function uploadMessage(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
  
      const file = req.files.file;
      const filePath = path.join(__dirname, file.name);
  
      await file.mv(filePath);
  
      const contents = fs.readFileSync(filePath, 'utf8');
  
      const message = parseMT799(contents);
  
      const [result] = await pool.query('INSERT INTO messages (message, created_at) VALUES (?, ?)', [JSON.stringify(message), new Date()]);
  
      logger.info(`Message saved with ID ${result.insertId}`);
  
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  async function getMessages(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM messages');
      res.render('messages', { messages: rows });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  function parseMT799(contents) {
    try {
      const message = {};
  
      const lines = contents.split('\n');
  
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();
          message[key] = value;
        }
      }
  
      return message;
    } catch (err) {
      throw new Error('Failed to parse MT799 message');
    }
  }

module.exports = {
  deleteMessage,
  uploadMessage,
  getMessages,
  parseMT799
};

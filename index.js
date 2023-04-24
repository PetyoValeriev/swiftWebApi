const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const methodOverride = require('method-override');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();

// define the path to the views directory
app.set('views', path.join(__dirname, 'views'));

//set the view engine to Pug
app.set('view engine', 'pug');
app.use('/views', express.static('views'));

// define the route for the homepage
app.get('/', (req, res) => {
  res.render('index');
});

//files upload
app.use(fileUpload());
app.use((req, res, next) => {
    // console.log(req.method, req.url);
    next();
});
//todo database connection 
//database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
// test the connection
pool.getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Error connecting to database:', err));

//method override
app.use(methodOverride('_method'));

app.delete('/messages/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        await pool.query('DELETE FROM messages WHERE id = ?', [messageId]);
        logger.info(`Message with ID ${messageId} deleted`);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//setting up a middleware to serve and display the API documentation generated from the Swagger document.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Upload a new MT799 message file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: MT799 message uploaded and saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the saved message
 *       400:
 *         description: Bad Request, file not provided
 *       500:
 *         description: Internal Server Error
 *   get:
 *     summary: Retrieve a list of all MT799 messages
 *     responses:
 *       200:
 *         description: A list of MT799 messages
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

// define a route to accept the message file
app.post('/messages', async (req, res) => {
    try {

        // check if the file exists in the request
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // get the uploaded file
        const file = req.files.file;
        const filePath = path.join(__dirname, file.name);

        // save the file to disk
        await file.mv(filePath);

        // read the contents of the file
        const contents = fs.readFileSync(filePath, 'utf8');

        // Parse the message
        const message = parseMT799(contents);

        // log the parsed message
        // console.log('Parsed message:', message);

        // Save the message to the database
        // console.log('before inserting into the database');
        const [result] = await pool.query('INSERT INTO messages (message, created_at) VALUES (?, ?)', [JSON.stringify(message), new Date()]);
        // console.log('after inserting into the database:', result);

        // Log the success
        logger.info(`Message saved with ID ${result.insertId}`);

        // Return a success response
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        // Log the error
        // console.error('Error in /messages POST route:', err);
        logger.error(err);

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to get all messages
app.get('/messages', async (req, res) => {
    try {
        // Get all messages from the database
        const [rows] = await pool.query('SELECT * FROM messages');

        // Render the messages template with the messages data
        res.render('messages', { messages: rows });
    } catch (err) {
        // Log the error
        logger.error(err);

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//todo func parseFile
function parseMT799(contents) {
  try {
    // Create an empty object to hold the parsed message data
    const message = {};

    // Split the message contents into an array of lines
    const lines = contents.split('\n');

    // Loop over each line in the message
    for (const line of lines) {
      // Find the index of the first colon in the line
      const colonIndex = line.indexOf(':');
      // If a colon was found in the line
      if (colonIndex !== -1) {
        // Extract the key and value from the line, trimming any whitespace
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        // Add the key-value pair to the message object
        message[key] = value;
      }
    }

    // Return the parsed message object
    return message;
  } catch (err) {
    // If an error occurs during parsing, log the error and throw an error
  //   console.error(err);
    throw new Error('Failed to parse MT799 message');
  }
}

// Start the server
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server started on port ${process.env.PORT || 3000}`);
  });
  
require('./swagger')(app);
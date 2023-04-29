const express = require('express');
const router = express.Router();
const { uploadMessage, getMessages, deleteMessage } = require('../controllers/messagesController.js');

// Existing Swagger documentation for POST and GET routes
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
router.post('/messages', uploadMessage);
router.get('/messages', getMessages);

// Add Swagger documentation for DELETE route

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a specific MT799 message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the MT799 message to delete
 *     responses:
 *       200:
 *         description: MT799 message deleted successfully
 *       404:
 *         description: MT799 message not found
 *       500:
 *         description: Internal Server Error
 */

router.delete('/messages/:id', deleteMessage);

module.exports = router;

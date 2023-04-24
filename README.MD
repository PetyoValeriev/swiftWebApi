Swift API
This is an API for accepting and storing MT799 messages. It provides the following endpoints:

API Endpoints
POST /messages - Upload a new MT799 message file
GET /messages - Retrieve a list of all MT799 messages
DELETE /messages/:id - Delete a message with the specified ID

Installation
Clone the repository: git clone https://github.com/PetyoValeriev/swiftWebApi.git
Install dependencies: npm install
Set up a MySQL database and update the config.js file with your database credentials
Start the server: npm start

Create a .env file in the root directory of the project and add the following variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=swift

Dependencies
This API uses the following dependencies:
Express: Web framework
mysql2: MySQL database driver
express-fileupload: Middleware for handling file uploads
winston: Logging library
method-override: Middleware for overriding HTTP methods
swagger-ui-express: Swagger UI for API documentation
yamljs: Library for reading YAML files
API Documentation
API documentation is available at /api-docs and is generated from the swagger.yaml file in the root directory.

Logging
This API uses Winston for logging. Logs are stored in the logs directory and are split by level (debug, info, error). 

Credits
This API was built by Petyo Pashev for a project at ProCreditBank.

License
This project is licensed under the MIT License - see the LICENSE file for details.

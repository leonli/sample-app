const express = require('express')
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://root:thepassword1234@127.0.0.1:5432/')
const app = express()
const port = 3000

const winston = require('winston');

// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger();

if (process.env.NODE_ENV == 'dev') {
  logger.add(new winston.transports.Console());
} else {
  logger.add(loggingWinston);
}

app.get('/', (req, res) => {
  res.send('Hello World!');
  logger.info('A Hello World Application is running.');
})

app.get('/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    logger.info('Connection has been established successfully.');
    console.log('Connection has been established successfully.');
    res.send('Connection has been established successfully.');
  } catch (error) {
    res.send('Unable to connect to the database.');
    logger.error('Unable to connect to the database:', error);
    console.error('Unable to connect to the database:', error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
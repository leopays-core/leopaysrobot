const db = require('./db');
const bot = require('./bot');
const env = require('./env');
const data = require('./data');
const config = require('./config');
const logger = require('./logger');
const server = require('./server');
const leopays = require('./leopays');
const session = require('./session');



// Define a schema
const schema = Object.assign(
  { /* */ },
  db,
  bot,
  env,
  data,
  config,
  logger,
  server,
  leopays,
  session,
);

module.exports = schema;

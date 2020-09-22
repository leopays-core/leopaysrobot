const appenders = require('./appenders');
const file = require('./file');
const gelf = require('./gelf');



const isProd = process.env.NODE_ENV === 'production';

// Define a schema
const schema = {
  logger: Object.assign(
    { /* */ },
    {
      level: {
        doc: "logger level",
        format: ["fatal", "error", "warn", "info", "debug", "trace"],
        default: isProd ? "info" : "trace",
      },
    },
    appenders,
    file,
    gelf,
  ),
}

module.exports = schema;

const { hostname } = require('os');



// Define a schema
const schema = {
  gelf: {
    host: {
      doc: "logger gelf host",
      format: String,
      default: "localhost",
    },
    port: {
      doc: "logger gelf port",
      format: Number,
      default: 12201,
    },
    hostname: {
      doc: "logger gelf hostname",
      format: String,
      default: 'LeoPaysRoBot', //hostname(),
    },
    facility: {
      doc: "logger gelf facility",
      format: String,
      default: "LeoPaysRoBot",
    },
    customFields: {
      doc: "logger gelf customFields",
      format: Object,
      default: {},
    },
  },
};

module.exports = schema;

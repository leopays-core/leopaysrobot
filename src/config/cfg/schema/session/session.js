const store = require('./session-store');
const isProd = process.env.NODE_ENV === 'production';



// Define a schema
const schema = {
  session: {
    name: {
      doc: "session name",
      format: String,
      default: "sid",//"connect.sid",
    },
    secret: {
      doc: "session secret",
      format: String,
      default: isProd ? undefined : "keyboard^cat",
    },
    resave: {
      doc: "session resave",
      format: Boolean,
      default: false,
    },
    saveUninitialized: {
      doc: "session saveUninitialized",
      format: Boolean,
      default: false,
    },
    store,
  }
};

module.exports = schema;

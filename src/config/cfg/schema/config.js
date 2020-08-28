// Define a schema
const schema = {
  config: {
    file: {
      doc: "config file name",
      format: String,
      default: "config.json",
      env: "CONFIG_FILE",
      arg: "config-file",
    }
  },
};

module.exports = schema;

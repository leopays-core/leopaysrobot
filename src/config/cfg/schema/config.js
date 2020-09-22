// Define a schema
const schema = {
  config: {
    file: {
      doc: "config file name",
      format: String,
      default: "config.json",
      env: "CONFIG_FILE",
      arg: "config-file",
    },
    save: {
      doc: "Force save/rewrite config file (The App will be shutdown)",
      format: Boolean,
      default: false,
      env: "CONFIG_FILE_SAVE",
      arg: "config-file-save",
    },
    print: {
      doc: "Print config file to console (The App will be shutdown)",
      format: Boolean,
      default: false,
      env: "CONFIG_FILE_PRINT",
      arg: "config-file-print",
    },
  },
};

module.exports = schema;

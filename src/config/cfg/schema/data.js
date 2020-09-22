// Define a schema
const schema = {
  data: {
    dir: {
      doc: "data.dir path",
      format: String,
      default: '../../../data',
      env: "DATA_DIR",
      arg: "data-dir",
    }
  },
};

module.exports = schema;

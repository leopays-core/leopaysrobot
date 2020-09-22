// Define a schema
const schema = {
  file: {
    name: {
      doc: "logger.file.name",
      format: String,
      default: "debug.log",
    },
    pattern: {
      doc: "logger.file.pattern",
      format: String,
      default: ".yyyy-MM-dd-hh",
    },
    keep_file_ext: {
      doc: "logger.file.keep_file_ext",
      format: Boolean,
      default: true,
    },
    encoding: {
      doc: "logger.file.encoding",
      format: String,
      default: "utf-8",
    },
    mode: {
      doc: "logger.file.mode",
      format: Number,
      default: 0o777,
    },
    flags: {
      doc: "logger.file.flags",
      format: String,
      default: "a",
    },
    compress: {
      doc: "logger.file.compress",
      format: Boolean,
      default: false,
    },
    always_include_pattern: {
      doc: "logger.file.always_include_pattern",
      format: Boolean,
      default: false,
    },
    days_to_keep: {
      doc: "logger.file.days_to_keep",
      format: Number,
      default: 1,
    }
  }
};

module.exports = schema;

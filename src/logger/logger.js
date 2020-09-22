const path = require('path');
const log4js = require('log4js');
const cfg = require('../config');



const filePath = path.resolve(
  __dirname,
  cfg.get('data.dir'),
  cfg.get('logger.file.name')
);

let options = {
  appenders: {
    stdout: { type: 'stdout' },
    stderr: { type: 'stderr' },
    file: {
      type: 'dateFile',
      filename: filePath,
      pattern: cfg.get('logger.file.pattern'),
      encoding: cfg.get('logger.file.encoding'),
      mode: cfg.get('logger.file.mode'),
      flags: cfg.get('logger.file.flags'),
      compress: cfg.get('logger.file.compress'),
      alwaysIncludePattern: cfg.get('logger.file.always_include_pattern'),
      daysToKeep: cfg.get('logger.file.days_to_keep'),
      keepFileExt: cfg.get('logger.file.keep_file_ext'),

      //maxSize: 1024,    // - the size in bytes to trigger a rollover, if not provided this defaults to MAX_SAFE_INTEGER and the stream will not roll.
      //numBackups: 3,    // - the number of old files to keep
    }
  },

  gelf: {
    type: '@log4js-node/gelf',
    host: cfg.get('logger.gelf.host'),
    port: cfg.get('logger.gelf.port'),
    hostname: cfg.get('logger.gelf.hostname'),
    facility: cfg.get('logger.gelf.facility'),
    customFields: cfg.get('logger.gelf.customFields'),
  },

  categories: {
    default: {
      appenders: ["file"],
      level: cfg.get('logger.level'),
    }
  }
};

if (cfg.get('logger.appenders.stdout')) options.categories.default.appenders.push('stdout');
if (cfg.get('logger.appenders.stderr')) options.categories.default.appenders.push('stderr');
if (cfg.get('logger.appenders.gelf')) options.categories.default.appenders.push('gelf');

log4js.configure(options);

module.exports = log4js;

/*
const logger = log4js.getLogger('name');
// fatal, error, warn, info, debug, trace
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
*/

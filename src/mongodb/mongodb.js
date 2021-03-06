const cfg = require('../config');
const mongoose = require('mongoose');
const models = require('./models');
const log = require('../logger').getLogger('mongoose');



//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = cfg.get('env') === 'production';

const getDbUri = () => {
  const usr =
    (cfg.get('db.user') !== undefined
      && cfg.get('db.pass') !== undefined)
      ? `${cfg.get('db.user')}:${cfg.get('db.pass')}@`
      : '';
  const srv = `${cfg.get('db.host')}:${cfg.get('db.port')}`;
  const name = `${cfg.get('db.name')}`;
  const uri = `mongodb://${usr}${srv}/${name}${usr !== '' ? '?authSource=admin' : ''}`;
  return uri;
}

const connectDb = (label = 'db') => {
  return new Promise((resolve, reject, onCancel) => {
    mongoose.set('debug', !isProduction);

    const uri = getDbUri();

    const options = {
      user: cfg.get('db.user') !== undefined ? cfg.get('db.user') : undefined,
      pass: cfg.get('db.pass') !== undefined ? cfg.get('db.pass') : undefined,
      dbName: cfg.get('db.name'),
      useNewUrlParser: cfg.get('db.options.useNewUrlParser'),
      bufferCommands: cfg.get('db.options.bufferCommands'),
      autoIndex: cfg.get('db.options.autoIndex'),
      autoReconnect: cfg.get('db.options.autoReconnect'),
      useFindAndModify: true,
    };

    mongoose.connect(uri, options)
      .then(
        (connection) => {
          log.debug(`'${label}'`, 'mongoose.connect() ok');
          resolve(connection);
        },
        (error) => {
          log.error(`'${label}'`, 'mongoose.connect() error', error);
          throw new Error(error);
        },
      )
      .catch((error) => {
        log.error(`'${label}'`, 'mongoose.connect() catched error:', error);
        throw new Error(error);
      });

    mongoose.connection.on('error', (error) => {
      log.error(`'${label}'`, "connection.on('error'). error:", error);
      throw new Error(error);
    });
    mongoose.connection.once('open', () => {
      log.debug(`'${label}'`, 'connection opened.');
    });
    mongoose.connection.on('connected', () => {
      log.info(`'${label}'`, 'Succesfully connected to MongoDB Database.');
    });

  });
};


module.exports.connectDb = connectDb;
module.exports.getDbUri = getDbUri;
module.exports.models = models;

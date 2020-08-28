const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cfg = require('../config');
const log = require('../logger');
const app = require('../app');


class Server {
  constructor() {
    this.logger = log.getLogger('server');
    this.app = null;
    this.http_server = null;
    this.https_server = null;
    this.init();
  }

  initApp() {
    this.app = app;
    // Get environment and store in Express.
    this.app.set('env', cfg.get('env'));
  }
  initServer() {
    // Create HTTP / HTTPS server.
    if (cfg.get('server.secure_mode')) {
      this.logger.debug('secure mode');
      this.http_server = http.createServer(this.app);
      this.http_server.on('error', onError('http-server'));
      this.http_server.on('listening', onListening('http-server'));

      let httpsOptions = {};
      if (cfg.get('server.https.pfx') !== undefined
        && cfg.get('server.https.pass') !== undefined) {
        this.logger.debug('pfx & passphrase defined');
        httpsOptions.pfx = getFile(cfg.get('server.https.pfx'));
        httpsOptions.passphrase = cfg.get('server.https.pass');
      } else if (cfg.get('server.https.key') !== undefined
        && cfg.get('server.https.cert') !== undefined) {
        this.logger.debug('key & cert defined');
        httpsOptions.key = getFile(cfg.get('server.https.key'));
        httpsOptions.cert = getFile(cfg.get('server.https.cert'));
        if (cfg.get('server.https.ca') !== undefined)
          httpsOptions.ca = getFile(cfg.get('server.https.ca'));
      } else {
        this.logger.fatal('HTTPS (TLS/SSL) Server Launch Error '
          + '(pfx & passphrase and key & cert undefined)');
        process.exit(1);
      }
      this.https_server = https.createServer(httpsOptions, this.app);
      this.https_server.on('error', onError('https-server'));
      this.https_server.on('listening', onListening('https-server'));
    } else {
      this.logger.debug('unsecure mode');
      this.http_server = http.createServer(this.app);
      this.http_server.on('error', onError('http-server'));
      this.http_server.on('listening', onListening('http-server'));
    }
  }
  init() {
    this.initApp();
    this.initServer();
  }

  start() {
    // Listen on provided port, on all network interfaces.
    const httpOptions = {
      host: cfg.get('server.host'),
      port: cfg.get('server.http.port'),
      exclusive: cfg.get('server.exclusive'),
      ipv6Only: cfg.get('server.ipv6Only'),
    };
    this.http_server.listen(httpOptions);

    if (cfg.get('server.secure_mode')) {
      const httpsOptions = {
        host: cfg.get('server.host'),
        port: cfg.get('server.https.port'),
        exclusive: cfg.get('server.exclusive'),
        ipv6Only: cfg.get('server.ipv6Only'),
      };

      this.https_server.listen(httpsOptions);
    }
  }

  stop() {
    this.http_server.close();
    if (cfg.get('server.secure_mode')) {
      this.https_server.close();
    }
    this.logger.debug('server stopped');
  }
  restart() {
    this.stop();
    this.init();
    this.start();
  }
}

// Event listener for HTTP server "error" event.
function onError(loggerName = "") {
  const logger = log.getLogger(loggerName);
  return (error) => {
    if (error.syscall !== 'listen') {
      logger.fatal('Error:', error);
      throw error;
    }

    //const bind = typeof cfg.get('server.port') === 'string'
    //  ? 'Pipe ' + cfg.get('server.port')
    //  : 'Port ' + cfg.get('server.port');
    const bind = 'bind';

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.fatal(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.fatal(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        logger.fatal('Error:', error);
        throw error;
    }
  }
}

// Event listener for HTTP server "listening" event.
function onListening(loggerName = "") {
  const logger = log.getLogger(loggerName);
  return function () {
    const addr = this.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.debug('Listening on ' + bind);
  }
}

function getFile(fileName) {
  const logger = log.getLogger('config');
  const fullPath = path.resolve(__dirname, cfg.get('data.dir'), fileName);
  if (!fs.existsSync(fullPath)) {
    logger.fatal(`File '${fileName}' not exists in path '${fullPath}'.`);
    process.exit(1);
  }
  return fs.readFileSync(fullPath);
}

module.exports = Server;

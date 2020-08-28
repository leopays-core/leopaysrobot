const fs = require('fs');
const path = require('path');
const convict = require('convict');
const schema = require('./schema');
const formats = require('./formats');


// Define a custom formats
convict.addFormats(formats);

// Define a schema
const cfg = convict(schema);

// Load environment dependent configuration
const env = cfg.get('env');

// Normalize a port into a number, string, or false.
cfg.set('server.http.port', normalizePort(cfg.get('server.http.port')));
cfg.set('server.https.port', normalizePort(cfg.get('server.https.port')));

const dataDirPath = path.resolve(__dirname, cfg.get('data.dir'));
cfg.set('data.dir', dataDirPath);
if (!fs.existsSync(dataDirPath)) {
  fs.mkdirSync(dataDirPath, {
    recursive: true, // Default: false.
    mode: 0o777,     // Not supported on Windows. Default: 0o777.
  });
  // init();
}

if (env !== 'production') {
  cfg.set('config.file', env + '-' + cfg.get('config.file'));
  cfg.set('logger.file.name', env + '-' + cfg.get('logger.file.name'));
}

const configFile = cfg.get('config.file');
const configFilePath = path.resolve(__dirname, cfg.get('data.dir'), configFile);
if (fs.existsSync(configFilePath)) {
  cfg.loadFile(configFilePath);
} else if (env === 'development') {
  // make config file
  fs.writeFileSync(
    configFilePath,
    cfg.toString(),
    {
      encoding: 'utf8', // Default: 'utf8'
      mode: 0o777,      // Default: 0o666
      flag: 'w',        // See support of file system flags. Default: 'w'.
    }
  );
}

// Perform validation
cfg.validate({ allowed: 'strict' });

//console.log(cfg.toString());

module.exports = cfg;

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;// named pipe
  if (port >= 0) return port;// port number
  return false;
}

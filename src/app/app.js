const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { connectLogger } = require('log4js');
const cfg = require('../config');
const log = require('../logger').getLogger('app');
const routes = require('../routes');



const app = express();

app.use(connectLogger(log));
app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const message = err.message;
  const error = cfg.get('env') === 'development' ? err : {};

  const status = err.status || 500;
  res.status(status);

  res.json({
    error: { code: status, message: message, data: error, },
    ok: false,
  });

  log.error('Error:', status, '-', message, '-', error);
  log.trace('Error req:', req);
});

module.exports = app;

const express = require('express');
const router = express.Router();
const log = require('../logger').getLogger('router->' + '/');



router.get('/', (req, res, next) => {
  log.trace('get', JSON.stringify(req));
  return res.json({
    ok: false,
  });
});

router.post('/', (req, res, next) => {
  log.trace('post', JSON.stringify(req));
  return res.json({
    ok: false,
  });
});

router.put('/', (req, res, next) => {
  log.trace('put', JSON.stringify(req));
  return res.json({
    ok: false,
  });
});

router.patch('/', (req, res, next) => {
  log.trace('patch', JSON.stringify(req));
  return res.json({
    ok: false,
  });
});

router.delete('/', (req, res, next) => {
  log.trace('delete', JSON.stringify(req));
  return res.json({
    ok: false,
  });
});

module.exports = router;

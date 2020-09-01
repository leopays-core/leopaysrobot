const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const { editMenuToAffiliate } = require('../lib');
const settings = require('../../../../settings');



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery } = ctx;
    const { c } = settings;

    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);
    let ts = 0;
    if (query !== null && query.ts !== undefined)
      ts = base58_to_int(query.ts);


    switch (url.pathname) {
      case `${c.affiliateL3}`:
        return editMenuToAffiliate(ctx);
      default:
        break;
    }

    return next();
  });
};

module.exports = applyHandlersOfCallbacks;

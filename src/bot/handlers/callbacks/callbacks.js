const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const applyHandlersOfCallbacksForAbout = require('./about');
const applyHandlersOfCallbacksForAccount = require('./account');
const applyHandlersOfCallbacksForAffiliate = require('./affiliate');
const applyHandlersOfCallbacksForNetwork = require('./network');
const applyHandlersOfCallbacksForSettings = require('./settings');
const applyHandlersOfCallbacksForWallet = require('./wallet');
const { msgOhSorry, } = require('../../messages');
const { } = require('../lib');



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', (ctx, next) => {
    const { callbackQuery } = ctx;
    next().then(() => {
      const url = urlapi.parse(callbackQuery.data);
      const query = url.query === null ? null : querystring.parse(url.query);
      const ts = (query !== null && query.ts !== null) ? base58_to_int(query.ts) : null;
      ctx.log.debug(
        `{ "callback_query": {` +
        `"id": ${ctx.callbackQuery.id}, ` +
        `"data_length": ${ctx.callbackQuery.data.length}, ` +
        `"data": ${JSON.stringify(ctx.callbackQuery.data)} ` +
        `} }`
      );
      ctx.log.trace(`{ "callback_query": ${JSON.stringify(ctx.callbackQuery)} }`);
    });
  });


  applyHandlersOfCallbacksForAbout(bot);
  applyHandlersOfCallbacksForAccount(bot);
  applyHandlersOfCallbacksForAffiliate(bot);
  applyHandlersOfCallbacksForNetwork(bot);
  applyHandlersOfCallbacksForSettings(bot);
  applyHandlersOfCallbacksForWallet(bot);


  bot.on('callback_query', (ctx) => {
    const { callbackQuery } = ctx;
    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);
    let ts = 0;
    if (query !== null && query.ts !== undefined)
      ts = base58_to_int(query.ts);

    ctx.answerCbQuery(msgOhSorry(ctx));
    ctx.log.warn(
      'not found callback_query handler',
      'ctx.callbackQuery:',
      ctx.callbackQuery.data,
      JSON.stringify(ctx.callbackQuery)
    );
  });
}
module.exports = applyHandlersOfCallbacks;

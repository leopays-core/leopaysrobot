const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const {
  editToMenuNetwork,
  editToMenuNetworkProds,
  sendMenuToAccount,
} = require('../lib');
const log = require('../../../logger').getLogger('callbacks:network');
const SS = require('../../../lib/smart-stringify');
const leopays = require('../../../leopays');
const settings = require('../../../../settings');



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery, session } = ctx;
    const { c } = settings;

    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);
    let ts = 0;
    if (query !== null && query.ts !== undefined)
      ts = base58_to_int(query.ts);


    switch (url.pathname) {
      case `${c.networkL3}`: {
        return editToMenuNetwork(ctx);
      }
      case `${c.networkL3}/prods`: {
        if (query !== null && query.p !== undefined) {
          console.log(query)
          return sendMenuToAccount(ctx, query.p);
        }

        const producersData = await leopays.rpc.get_table_rows({
          code: 'lpc', scope: 'lpc', table: 'producers',
          index_position: 2, key_type: 'float64',
          limit: 50,
        });
        return editToMenuNetworkProds(ctx, producersData);
      }
      default:
        break;
    }

    return next();
  });
};

module.exports = applyHandlersOfCallbacks;

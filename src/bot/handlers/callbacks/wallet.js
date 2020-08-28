const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const { sendMenuWallet, sendMenuWalletReceive, sendMenuSelecAccount } = require('../lib');
const settings = require('../../../../settings');
const { c } = settings;



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery, i18n, session, } = ctx;

    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);
    const ts = query !== null ? base58_to_int(query.ts) : null;

    switch (url.pathname) {
      case `${c.walletL3}`:
        return sendMenuWallet(ctx);
      case `${c.walletL3}/stake`:
        return ctx.scene.enter('account-delegatebw');
      case `${c.walletL3}/vote`:
        return ctx.scene.enter('account-voteproducer');
      case `${c.walletL3}/unstake`:
        return ctx.scene.enter('account-undelegatebw');
      case `${c.walletL3}/claim`:
        return ctx.scene.enter('account-claimrewards');
      case `${c.walletL3}/receive`:
        return sendMenuWalletReceive(ctx);
      case `${c.walletL3}/send`:
        return ctx.scene.enter('token-transfer');
      default:
        break;
    }

    return next();
  });
};
module.exports = applyHandlersOfCallbacks;


function checkAccount(ctx) {
  if (ctx.session.user.account.length === 0) {
    ctx.answerCbQuery('Аккаунт не создан! Сперва создайте аккаунт!');
    return false;
  }
  return true;
}

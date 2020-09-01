const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const { sendMenuTransaction,
  editMenuToAccounts, editMenuToAccount,
} = require('../lib');
const log = require('../../../logger').getLogger('callbacks:account');
const SS = require('../../../lib/smart-stringify');
const settings = require('../../../../settings');
const { maxAccountsPerUser } = settings;
const leopays = require('../../../leopays');



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery, session } = ctx;
    const { c } = settings;

    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);
    const ts = query !== null ? base58_to_int(query.ts) : null;

    switch (url.pathname) {
      case `${c.accountL3}`:
        return editMenuToAccounts(ctx);
      case `${c.accountL3}/a`: {
        const account = query.a;
        let accInfo = await leopays.rpc.get_account(account);
        return editMenuToAccount(ctx, account);
      }

      case `${c.accountL3}/set_main`: {
        const account = query.a;
        console.log(query)
        const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { account_main: account }, { new: true, upsert: true });
        session.user = doc.toJSON();
        console.log(session.user)
        return editMenuToAccount(ctx, account);
      }

      case `${c.accountL3}/set_proxy`: {
        const account = query.a;
        const accInfo = await leopays.rpc.get_account(account);
        const is_proxy = accInfo.voter_info && accInfo.voter_info.is_proxy;
        return leopays.regProxy(account, !is_proxy).then(async (transaction) => {
          sendMenuTransaction(ctx, transaction);
          return editMenuToAccount(ctx, account);
        }).catch((error) => {
          log.error((SS(error)));
          const extra = getExtra({ html: true });
          ctx.reply('<b>Нода вернула ошибку</b>', extra);
        });
      }

      case `${c.accountL3}/regprod`: {
        const account = query.a;
        const producersRows = await leopays.rpc.get_table_rows({
          code: 'lpc', scope: 'lpc', table: 'producers', lower_bound: account, limit: 1, show_payer: true,
        });
        let prodInfo = {};
        if (producersRows.rows.length > 0)
          prodInfo = producersRows.rows[0].data;

        ctx.session.temp = {
          producer: account,
          producer_key: undefined,
          url: undefined,
          location: 0,
          prodInfo,
        };
        return ctx.scene.enter('account-regproducer');
      }

      case `${c.accountL3}/unregprod`: {
        const account = query.a;
        return leopays.accountUnRegProducer(account).then(async (transaction) => {
          sendMenuTransaction(ctx, transaction);
          return editMenuToAccount(ctx, account);
        }).catch((error) => {
          log.error((SS(error)));
          const extra = getExtra({ html: true });
          ctx.reply('<b>Нода вернула ошибку</b>', extra);
        });
      }

      case `${c.accountL3}/create`: {
        if (session.user.accounts.length <= maxAccountsPerUser)
          return ctx.scene.enter('account-create');
        else
          ctx.answerCbQuery(`Не более ${maxAccountsPerUser} шт аккаунтов.`);
      }
      default:
        break;
    }

    return next();
  });
};

module.exports = applyHandlersOfCallbacks;

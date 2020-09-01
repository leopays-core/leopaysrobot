const getExtra = require('../../extra');
const { msgMenuTransaction,
  msgMenuAccounts, msgMenuAccount, msgMenuAccountCreate, msgMenuAccountSendPubKey,
} = require('../../messages');
const { ikbMenuTransaction,
  ikbMenuAccounts, ikbMenuAccount, ikbMenuBack, kbCancel,
  kbMenuAccountRegProducerCancelGenerate,
} = require('../../keyboards');
const settings = require('../../../../settings');
const SS = require('../../../lib/smart-stringify');
const leopays = require('../../../leopays');



async function sendMenuTransaction(ctx, transaction) {
  const text = msgMenuTransaction(ctx, transaction);
  const keyboard = ikbMenuTransaction(ctx, transaction);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
async function sendMenuTransactionError(ctx, errorObj) {
  let txt = `<b>Узел LeoPays вернул ошибку</b>\n\n`;
  txt += `<code>${SS(errorObj)}</code>`;
  const extra = getExtra({ html: true });
  return ctx.reply(txt, extra);
}



async function sendMenuAccounts(ctx) {
  const text = msgMenuAccounts(ctx);
  const keyboard = ikbMenuAccounts(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function editMenuToAccounts(ctx) {
  const text = msgMenuAccounts(ctx);
  const keyboard = ikbMenuAccounts(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}


async function sendMenuAccountCreate(ctx) {
  const text = msgMenuAccountCreate(ctx);
  const keyboard = kbCancel(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function getProducers(limit = 100, lower_bound) {
  return await leopays.rpc.get_table_rows({
    json: true, code: 'lpc', scope: 'lpc', table: 'producers',
    lower_bound, limit,
  });

}

async function getAccountData(account) {
  const accInfo = await leopays.rpc.get_account(account);

  let prodInfo = {};
  let limit = 100;
  let lower_bound = null;
  let more = true;
  while (more) {
    let data = await getProducers(limit, lower_bound);
    for (let i in data.rows) {
      if (data.rows[i].owner === account) {
        more = false;
        prodInfo = data.rows[i];
      } else
        lower_bound = data.rows[i].owner;
    }

    limit = 101;
    more = data.more;
  }

  return { accInfo, prodInfo };
}
async function editMenuToAccount(ctx, account) {
  const data = await getAccountData(account);
  const text = msgMenuAccount(ctx, account, data.accInfo, data.prodInfo);
  const keyboard = ikbMenuAccount(ctx, account, data.accInfo, data.prodInfo);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
async function sendMenuToAccount(ctx, account) {
  const data = await getAccountData(account);
  const text = msgMenuAccount(ctx, account, data.accInfo, data.prodInfo);
  let keyboard = {};
  if (ctx.session.user.accounts.includes(account))
    keyboard = ikbMenuAccount(ctx, account, data.accInfo, data.prodInfo);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function sendMenuAccountRegProd(ctx, account) {
  const data = await getAccountData(account);
  const text = msgMenuAccountSendPubKey(ctx, account, data.accInfo, data.prodInfo);
  const keyboard = kbMenuAccountRegProducerCancelGenerate(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}

module.exports = {
  sendMenuTransaction,
  sendMenuTransactionError,
  sendMenuAccounts,
  editMenuToAccounts,
  sendMenuAccountCreate,
  getAccountData,
  sendMenuToAccount,
  editMenuToAccount,
  sendMenuAccountRegProd,
};

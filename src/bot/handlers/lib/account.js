const getExtra = require('../../extra');
const { msgMenuTransaction,
  msgMenuAccounts, msgMenuAccount, msgMenuAccountCreate, msgMenuAccountSendPubKey,
} = require('../../messages');
const { ikbMenuTransaction,
  ikbMenuAccounts, ikbMenuAccount, ikbMenuBack, kbCancel,
  kbMenuAccountRegProducerCancelGenerate,
} = require('../../keyboards');
const settings = require('../../../../settings');
const leopays = require('../../../leopays');



async function sendMenuTransaction(ctx, transaction) {
  const text = msgMenuTransaction(ctx, transaction);
  const keyboard = ikbMenuTransaction(ctx, transaction);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
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


async function getAccountData(account) {
  const accInfo = await leopays.rpc.get_account(account);
  const producersRows = await leopays.rpc.get_table_rows({
    code: 'lpc', scope: 'lpc', table: 'producers',
    lower_bound: account, limit: 1, show_payer: true,
  });
  let prodInfo = {};
  if (producersRows.rows.length > 0)
    prodInfo = producersRows.rows[0].data;
  //const is_active = prodInfo.is_active ? prodInfo.is_active : false;
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
  sendMenuAccounts,
  editMenuToAccounts,
  sendMenuAccountCreate,
  getAccountData,
  sendMenuToAccount,
  editMenuToAccount,
  sendMenuAccountRegProd,
};

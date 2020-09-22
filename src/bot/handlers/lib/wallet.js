const getExtra = require('../../extra');
const {
  msgMenuWallet,
  msgMenuWalletReceive,
} = require('../../messages');
const {
  ikbMenuWallet,
} = require('../../keyboards');
const SS = require('../../../lib/smart-stringify');
const settings = require('../../../../settings');
const { c } = settings;




async function sendMenuWallet(ctx) {
  const text = await msgMenuWallet(ctx);
  const keyboard = ikbMenuWallet(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function editMenuToWallet(ctx) {
  const text = msgMenuWallet(ctx);
  const keyboard = ikbMenuWallet(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}

async function sendMenuWalletReceive(ctx) {
  const text = msgMenuWalletReceive(ctx);
  const extra = getExtra({ html: true });
  return ctx.reply(text, extra);
}



module.exports = {
  sendMenuWallet,
  editMenuToWallet,
  sendMenuWalletReceive,
};

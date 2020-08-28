const getExtra = require('../../extra');
const { msgMenu } = require('../../messages');
const { ikbMenu } = require('../../keyboards');



async function sendMenu(ctx) {
  const text = msgMenu(ctx);
  const keyboard = ikbMenu(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenu = sendMenu;

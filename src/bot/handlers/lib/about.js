const getExtra = require('../../extra');
const { msgMenuAbout } = require('../../messages');
const { ikbMenuAbout } = require('../../keyboards');



async function sendMenuAbout(ctx) {
  const text = msgMenuAbout(ctx);
  const keyboard = ikbMenuAbout(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function editMenuToAbout(ctx) {
  const text = msgMenuAbout(ctx);
  const keyboard = ikbMenuAbout(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}


module.exports = {
  sendMenuAbout,
  editMenuToAbout,
};

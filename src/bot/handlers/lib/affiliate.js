const getExtra = require('../../extra');
const { msgMenuAffiliate } = require('../../messages');
const { ikbMenuBack } = require('../../keyboards');
const settings = require('../../../../settings');



async function editMenuToAffiliate(ctx) {
  const { c } = settings;
  const text = msgMenuAffiliate(ctx);
  const keyboard = ikbMenuBack(ctx, { back: `${c.aboutL3}` });
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}


module.exports = {
  editMenuToAffiliate,
};

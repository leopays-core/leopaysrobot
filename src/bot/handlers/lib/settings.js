const urlapi = require('url');
const getExtra = require('../../extra');
const {
  msgMenuSettings, msgMenuSettingsLanguage,
} = require('../../messages');
const {
  ikbMenuSettings,
  ikbMenuSettingsLanguage,
} = require('../../keyboards');
const SS = require('../../../lib/smart-stringify');
const settings = require('../../../../settings');
const { c } = settings;



async function sendMenuSettings(ctx) {
  const text = msgMenuSettings(ctx);
  const keyboard = ikbMenuSettings(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}

async function editMenuToSettings(ctx) {
  const text = msgMenuSettings(ctx);
  const keyboard = ikbMenuSettings(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}

async function editMenuToSettingsLanguage(ctx, params) {
  const text = msgMenuSettingsLanguage(ctx);
  const keyboard = await ikbMenuSettingsLanguage(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}

async function editIkbToSettingsLanguage(ctx, params) {
  const keyboard = await ikbMenuSettingsLanguage(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageReplyMarkup(extra.reply_markup);
}


module.exports = {
  editIkbToSettingsLanguage,
  editMenuToSettingsLanguage,
  editMenuToSettings,
  sendMenuSettings,
};
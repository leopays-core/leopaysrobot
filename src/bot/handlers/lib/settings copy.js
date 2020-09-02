const urlapi = require('url');
const getExtra = require('../../extra');
const {
  msgMenuSettingsPublicNameChange,
  msgMenuSettingsPublicNameChangeQuestion,
  msgMenuSettingsPublicNameChangeWrong,
  msgMenuSettingsPublicNameChangeSuccessful,
  msgMenuSettingsCurrentCurrency,
  msgMenuSettings, msgMenuSettingsLanguage,
  msgMenuSettingsRate,
  msgMenuSettingsFavoriteAddresses,
  msgMenuSettingsTimeZone,
  msgMenuSettingsNotification,
  msgMenuSettingsNotificationChangeMode,
} = require('../../messages');
const {
  ikbMenuYesNo, kbCancel,
  ikbMenuSettings,
  ikbMenuSettingsLanguage, ikbMenuSettingsCurrency,
  ikbMenuSettingsRate,
  ikbMenuSettingsFavoriteAddresses,
  ikbMenuSettingsTimeZone,
  ikbMenuSettingsNotification,
  ikbMenuSettingsNotificationChangeMode,
} = require('../../keyboards');
const { c } = require('../../default-data');


async function sendMenuSettings(ctx) {
  const text = msgMenuSettings(ctx);
  const keyboard = ikbMenuSettings(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettings = sendMenuSettings;


async function editMenuToSettings(ctx) {
  const text = msgMenuSettings(ctx);
  const keyboard = ikbMenuSettings(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
module.exports.editMenuToSettings = editMenuToSettings;


async function editMenuToSettingsLanguage(ctx, params) {
  const text = msgMenuSettingsLanguage(ctx);
  const keyboard = await ikbMenuSettingsLanguage(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
module.exports.editMenuToSettingsLanguage = editMenuToSettingsLanguage;


async function editIkbToSettingsLanguage(ctx, params) {
  const keyboard = await ikbMenuSettingsLanguage(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageReplyMarkup(extra.reply_markup);
}
module.exports.editIkbToSettingsLanguage = editIkbToSettingsLanguage;


async function sendMenuSettingsCurrency(ctx, params) {
  const text = msgMenuSettingsCurrentCurrency(ctx);
  const keyboard = await ikbMenuSettingsCurrency(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsCurrency = sendMenuSettingsCurrency;


async function editIkbToSettingsCurrency(ctx, params) {
  const keyboard = await ikbMenuSettingsCurrency(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageReplyMarkup(extra.reply_markup);
}
module.exports.editIkbToSettingsCurrency = editIkbToSettingsCurrency;


async function editMenuToSettingsCurrency(ctx, params) {
  const text = msgMenuSettingsCurrentCurrency(ctx);
  const keyboard = await ikbMenuSettingsCurrency(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
module.exports.editMenuToSettingsCurrency = editMenuToSettingsCurrency;


async function sendMenuSettingsPublicNameChange(ctx) {
  const text = msgMenuSettingsPublicNameChange(ctx);
  const keyboard = kbCancel(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsPublicNameChange = sendMenuSettingsPublicNameChange;


async function sendMenuSettingsPublicNameChangeQuestion(ctx, data) {
  const text = msgMenuSettingsPublicNameChangeQuestion(ctx, data);
  const keyboard = ikbMenuYesNo(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsPublicNameChangeQuestion = sendMenuSettingsPublicNameChangeQuestion;


async function sendMenuSettingsPublicNameChangeWrong(ctx) {
  const text = msgMenuSettingsPublicNameChangeWrong(ctx);
  const extra = getExtra({ html: true });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsPublicNameChangeWrong = sendMenuSettingsPublicNameChangeWrong;


async function sendMenuSettingsPublicNameChangeSuccessful(ctx) {
  const text = msgMenuSettingsPublicNameChangeSuccessful(ctx);
  const extra = getExtra({ html: true });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsPublicNameChangeSuccessful = sendMenuSettingsPublicNameChangeSuccessful;


async function editMenuToSettingsRate(ctx) {
  const { db, session } = ctx;
  const list = await db.getRatesSortedList({
    base_currency: session.user.currency,
    market_currency: "BTC",
  });
  const params = { ...list, };
  const text = await msgMenuSettingsRate(ctx, params);
  const keyboard = ikbMenuSettingsRate(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
module.exports.editMenuToSettingsRate = editMenuToSettingsRate;


async function sendMenuSettingsFavoriteAddresses(ctx) {
  const text = msgMenuSettingsFavoriteAddresses(ctx);
  const keyboard = ikbMenuSettingsFavoriteAddresses(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsFavoriteAddresses = sendMenuSettingsFavoriteAddresses;


async function sendMenuSettingsTimeZone(ctx, params) {
  const text = msgMenuSettingsTimeZone(ctx);
  const keyboard = await ikbMenuSettingsTimeZone(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsTimeZone = sendMenuSettingsTimeZone;


async function editMenuToSettingsTimeZone(ctx, params) {
  const text = msgMenuSettingsTimeZone(ctx);
  const keyboard = await ikbMenuSettingsTimeZone(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
module.exports.editMenuToSettingsTimeZone = editMenuToSettingsTimeZone;


async function editIkbToSettingsTimeZone(ctx, params) {
  const keyboard = await ikbMenuSettingsTimeZone(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageReplyMarkup(extra.reply_markup);
}
module.exports.editIkbToSettingsTimeZone = editIkbToSettingsTimeZone;


async function sendMenuSettingsNotification(ctx) {
  const text = msgMenuSettingsNotification(ctx);
  const keyboard = ikbMenuSettingsNotification(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsNotification = sendMenuSettingsNotification;


async function sendMenuSettingsNotificationChangeMode(ctx, params = { type }) {
  const text = msgMenuSettingsNotificationChangeMode(ctx, params);
  const keyboard = await ikbMenuSettingsNotificationChangeMode(ctx, params);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
module.exports.sendMenuSettingsNotificationChangeMode = sendMenuSettingsNotificationChangeMode;

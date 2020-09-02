const Base58 = require('base58');
const urlapi = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const Language = mongoose.model('Language');
const {
  inlineKeyboard, callbackButton,
} = require('telegraf/markup');
const db = require('../db');
const settings = require('../../../settings');
const { c } = settings;



const ikbMenuSettings = (ctx) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000));
  const { i18n, session } = ctx;
  let kbArray = [];

  kbArray.push([
    callbackButton(
      i18n.t('Language'),
      urlapi.format({ pathname: `${c.settingsL3}/lng`, query: { ts, }, }),
    )
  ]);

  return inlineKeyboard(kbArray);
}


const ikbMenuSettingsLanguage = async (ctx, params = { limit: 20, offset: 0 }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000));
  const { i18n } = ctx;
  let kbArray = [];
  const maxInRow = 2;
  let row = [];

  const data = await db.getLanguagesSortedList({
    limit: params.limit, offset: params.offset,
  });

  for (let i in data.list) {
    if (row.length >= maxInRow) {
      kbArray.push(row);
      row = [];
    }
    if (data.list[i].visible)
      row.push(
        callbackButton(
          `${(data.list[i].emoji)} ${data.list[i].name}/${data.list[i].native}`,
          urlapi.format({
            pathname: `${c.settingsL3}/lng`,
            query: { id: data.list[i].code, l: data.limit, o: data.offset, },
          }),
          !data.list[i].visible
        )
      );
  }
  if (row.length > 0) {
    kbArray.push(row);
    row = [];
  }

  const pages_total = Math.ceil(data.count / data.limit) || 1;
  const page_cur = (data.offset + data.limit) / data.limit;
  const page_next = (page_cur === pages_total)
    ? 1 : page_cur + 1;
  const offset_next = (page_cur === pages_total)
    ? 0 : data.offset + data.limit;
  const page_prev = (page_cur === 1)
    ? pages_total : page_cur - 1;
  const offset_prev = (page_cur === 1)
    ? pages_total * data.limit - data.limit : data.offset - data.limit;

  kbArray.push([
    callbackButton(
      `${page_prev}/${pages_total}`,
      urlapi.format({
        pathname: `${c.settingsL3}/lng`,
        query: { l: data.limit, o: offset_prev, },
      }),
      pages_total === 1,
    ),
    callbackButton(
      i18n.t('Back'),
      urlapi.format({ pathname: `${c.settingsL3}` }),
    ),
    callbackButton(
      `${page_next}/${pages_total}`,
      urlapi.format({
        pathname: `${c.settingsL3}/lng`,
        query: { l: data.limit, o: offset_next, },
      }),
      pages_total === 1,
    ),
  ]);

  return inlineKeyboard(kbArray);
}


module.exports = {
  ikbMenuSettingsLanguage,
  ikbMenuSettings,
};

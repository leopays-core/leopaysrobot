const { inlineKeyboard, urlButton, callbackButton } = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const settings = require('../../../settings');
const cfg = require('../../config');



const ikbMenuAbout = (ctx) => {
  const { i18n } = ctx;
  const { c, explorer } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];
  const explorerUrl = explorer.global.url + explorer.global.query;
  const explorerUrlLocal = explorer.local.url + explorer.local.query;

  kbArray.push([
    callbackButton(
      i18n.t('Affiliate system'),
      urlapi.format({ pathname: `${c.affiliateL3}`, query: { ts: ts, }, }),
    )
  ]);

  kbArray.push([
    urlButton(i18n.t('Explorer (Bloks.io)'), explorerUrl),
  ]);
  if (cfg.get('env') !== 'production') {
    kbArray.push([
      urlButton(i18n.t('Explorer (Bloks.io) local node'), explorerUrlLocal),
    ]);
  }

  return inlineKeyboard(kbArray);
}


module.exports = {
  ikbMenuAbout,
};

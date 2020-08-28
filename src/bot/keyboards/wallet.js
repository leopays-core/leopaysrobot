const { inlineKeyboard, callbackButton } = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const settings = require('../../../settings');
const { c } = settings;



const ikbMenuWallet = (ctx) => {
  const { i18n } = ctx;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));
  const kbArray = [];

  kbArray.push([
    callbackButton(
      i18n.t('Stake'),
      urlapi.format({ pathname: `${c.walletL3}/stake`, query: { ts, }, }),
    ),
    callbackButton(
      i18n.t('Unstake'),
      urlapi.format({ pathname: `${c.walletL3}/unstake`, query: { ts, }, }),
    )
  ]);

  kbArray.push([
    callbackButton(
      i18n.t('Vote'),
      urlapi.format({ pathname: `${c.walletL3}/vote`, query: { ts, }, }),
    ),
    callbackButton(
      i18n.t('Claim rewards'),
      urlapi.format({ pathname: `${c.walletL3}/claim`, query: { ts, }, }),
    )
  ]);

  kbArray.push([
    callbackButton(
      i18n.t('Receive'),
      urlapi.format({ pathname: `${c.walletL3}/receive`, query: { ts, }, }),
    ),
    callbackButton(
      i18n.t('Send'),
      urlapi.format({ pathname: `${c.walletL3}/send`, query: { ts, }, }),
    )
  ]);

  return inlineKeyboard(kbArray);
}


module.exports = {
  ikbMenuWallet,
};

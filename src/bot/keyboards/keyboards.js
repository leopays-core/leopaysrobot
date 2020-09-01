const {
  keyboard, inlineKeyboard,
  button, urlButton, callbackButton,
} = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const aboutKeyboards = require('./about');
const accountKeyboards = require('./account');
const walletKeyboards = require('./wallet');
const settings = require('../../../settings');
const cfg = require('../../config');
const stringToBoolean = require('../../lib/string-to-boolean');




const kbStart = (ctx) => {
  const kbArray = [
    button('/start'),
  ];
  return keyboard(kbArray).resize();
}


const kbCancel = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel'))
  ];
  return keyboard(kbArray).resize();
}
const kbCancelNext = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel')),
    button(ctx.i18n.t('Next'))
  ];
  return keyboard(kbArray).resize();
}
const kbCancelSkip = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel')),
    button(ctx.i18n.t('Skip'))
  ];
  return keyboard(kbArray).resize();
}
const kbListAndCancel = (ctx, arr = []) => {
  const kbArray = [];
  kbArray.push(ctx.i18n.t('Cancel'));
  for (let i in arr)
    kbArray.push(button(arr[i]));
  return keyboard(kbArray).resize();
}


const kbIAgree = (ctx) => {
  const { i18n } = ctx;
  const kbArray = [];
  kbArray.push([
    button(i18n.t('I totally agree')),
  ]);
  return keyboard(kbArray).resize();
}


const kbMain = (ctx) => {
  const { i18n } = ctx;
  const kbArray = [];

  kbArray.push([
    button(i18n.t('Wallet')),
    button(i18n.t('Account')),
  ]);
  kbArray.push([
    button(i18n.t('About')),
    //button(i18n.t('Settings')),
  ]);

  return keyboard(kbArray).resize();
}


const ikbMenuShortInfo = (ctx) => {
  const { i18n } = ctx;
  const { explorer } = settings;
  const kbArray = [];

  const explorer_url = explorer.global.url + explorer.global.query;
  const explorer_local_url = explorer.local.url + explorer.local.query;

  kbArray.push([
    urlButton(i18n.t('Explorer (Bloks.io)'), explorer_url),
  ]);
  if (cfg.get('env') !== 'production') {
    kbArray.push([
      urlButton(i18n.t('Explorer (Bloks.io) local node'), explorer_local_url),
    ]);
  }

  return inlineKeyboard(kbArray);
}


const ikbMenuProducers = (producersdata = { rows: [], more: false }, selectes = []) => {
  const kbArray = [];
  console.log(producersdata)
  for (let i in producersdata.rows) {
    const pathname = '';
    const query = {
      p: producersdata.rows[i].owner,
      m: producersdata.rows[i].more,
    };
    const isActive = stringToBoolean(producersdata.rows[i].is_active);
    if (isActive)
      kbArray.push([
        callbackButton(
          producersdata.rows[i].owner,
          urlapi.format({ pathname, query, }),
        ),
      ]);
  }
  //'?a=leopaysnode2&m=&v=9153188755689658.00000000000000000'
  console.log(kbArray)
  return inlineKeyboard(kbArray);
}



const ikbMenuBack = (ctx, data) => {
  const { i18n } = ctx;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];
  const pathname = data.back ? data.back : 'back';
  const query = { ts: ts, };
  kbArray.push([
    callbackButton(
      i18n.t('Back'),
      urlapi.format({ pathname, query, }),
    ),
  ]);
  return inlineKeyboard(kbArray);
}




const ikbMenuTransaction = (ctx, transaction) => {
  const { i18n } = ctx;
  const { explorer } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];
  const explorer_url = explorer.global.url + '/transaction/' + transaction.transaction_id + explorer.global.query;
  const explorer_local_url = explorer.local.url + '/transaction/' + transaction.transaction_id + explorer.local.query;
  kbArray.push([
    urlButton(i18n.t('See TX in Explorer (Bloks.io)'), explorer_url),
  ]);
  if (cfg.get('env') !== 'production') {
    kbArray.push([
      urlButton(i18n.t('See TX in Explorer (Bloks.io) local node'), explorer_local_url),
    ]);
  }
  return inlineKeyboard(kbArray);
}


const ikbMenuSelecAccount = (ctx, pathname, accounts) => {
  const { i18n } = ctx;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];
  for (let i in accounts) {
    const query = { ts, a: accounts[i], };
    kbArray.push([
      callbackButton(i18n.t(accounts[i]), urlapi.format({ pathname, query, })),
    ]);
  }
  return inlineKeyboard(kbArray);
}



module.exports = {
  kbStart,
  kbCancel,
  kbCancelNext,
  kbCancelSkip,
  kbListAndCancel,
  kbIAgree,
  kbMain,
  ikbMenuBack,
  ikbMenuShortInfo,
  ikbMenuTransaction,
  ikbMenuSelecAccount,
  ikbMenuProducers,
  ...aboutKeyboards,
  ...accountKeyboards,
  ...walletKeyboards,
};

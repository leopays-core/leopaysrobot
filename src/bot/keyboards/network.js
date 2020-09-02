const {
  inlineKeyboard, callbackButton,
} = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const settings = require('../../../settings');
const cfg = require('../../config');
const stringToBoolean = require('../../lib/string-to-boolean');




const ikbMenuNetwork = (ctx) => {
  const { i18n } = ctx;
  const { c, explorer } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));
  const explorerUrl = explorer.global.url + explorer.global.query;
  const explorerUrlLocal = explorer.local.url + explorer.local.query;
  const kbArray = [];

  kbArray.push([
    callbackButton(
      i18n.t('Block Producers'),
      urlapi.format({ pathname: `${c.networkL3}/prods`, query: { ts, }, }),
    ),
  ]);

  kbArray.push([
    urlButton(`${i18n.t('Explorer')} (Bloks.io)`, explorerUrl),
  ]);
  if (cfg.get('env') !== 'production') {
    kbArray.push([
      urlButton(`${i18n.t('Explorer')} (Bloks.io) ${i18n.t('Local node')}`, explorerUrlLocal),
    ]);
  }


  return inlineKeyboard(kbArray);
}

const ikbMenuNetworkProds = (ctx, producersdata = { rows: [], more: false }, selected = []) => {
  const { i18n } = ctx;
  const { c } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));
  const kbArray = [];
  const kbArrayRowSize = 2;
  let kbArrayRow = [];

  for (let i in producersdata.rows) {
    const pathname = `${c.networkL3}/prods`;
    const query = {
      p: producersdata.rows[i].owner,
      m: producersdata.rows[i].more,
      ts,
    };
    const isActive = stringToBoolean(producersdata.rows[i].is_active);
    if (isActive) {
      if (!(kbArrayRow.length < kbArrayRowSize)) {
        kbArray.push(kbArrayRow);
        kbArrayRow = [];
      }

      kbArrayRow.push(
        callbackButton(
          producersdata.rows[i].owner,
          urlapi.format({ pathname, query, }),
        ),
      );
    }
  }
  if (kbArrayRow.length > 0)
    kbArray.push(kbArrayRow);

  kbArray.push([
    callbackButton(
      i18n.t('Back'),
      urlapi.format({ pathname: `${c.networkL3}`, query: { ts, }, }),
    ),
  ]);

  return inlineKeyboard(kbArray);
}



const ikbMenuProducers = (producersdata = { rows: [], more: false }, selected = []) => {
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));
  const kbArray = [];
  const kbArrayRowSize = 2;
  let kbArrayRow = [];

  for (let i in producersdata.rows) {
    const pathname = '';
    const query = {
      p: producersdata.rows[i].owner,
      m: producersdata.rows[i].more,
      ts,
    };
    const isActive = stringToBoolean(producersdata.rows[i].is_active);
    if (isActive) {
      if (!(kbArrayRow.length < kbArrayRowSize)) {
        kbArray.push(kbArrayRow);
        kbArrayRow = [];
      }

      let sel = '';
      if (selected.includes(producersdata.rows[i].owner))
        sel = '✅ ';
      kbArrayRow.push(
        callbackButton(
          `${sel}${producersdata.rows[i].owner}`,
          urlapi.format({ pathname, query, }),
        )
      );
    }
  }
  if (kbArrayRow.length > 0)
    kbArray.push(kbArrayRow);

  return inlineKeyboard(kbArray);
}


module.exports = {
  ikbMenuNetwork,
  ikbMenuNetworkProds,
  ikbMenuProducers
};

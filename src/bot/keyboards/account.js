const {
  inlineKeyboard, urlButton, callbackButton, button, keyboard,
} = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const settings = require('../../../settings');



const ikbMenuAccounts = (ctx) => {
  const { i18n, session } = ctx;
  const { user } = session;
  const { c } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];

  for (let i in user.accounts) {
    let emoji = '👤';
    const a = user.accounts[i];
    if (a === user.account_main)
      emoji += '⭐️';
    kbArray.push([
      callbackButton(
        `${emoji} ${a}`,// ⛏🗣
        urlapi.format({ pathname: `${c.accountL3}/a`, query: { ts, a, }, }),
      )
    ]);
  }

  kbArray.push([
    callbackButton(
      i18n.t('Create new account'),
      urlapi.format({ pathname: `${c.accountL3}/create`, query: { ts, }, }),
    )
  ]);

  return inlineKeyboard(kbArray);
}


const ikbMenuAccount = (ctx, account, accInfo, prodInfo) => {
  const { i18n, session } = ctx;
  const { user } = session;
  const { c } = settings;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const a = accInfo.account_name;
  const kbArray = [];
  {
    let emoji = '';
    const is_main = accInfo.account_name === user.account_main;
    if (is_main) emoji = '⭐️';
    const pathname = `${c.accountL3}/set_main`;
    const query = { ts, a, };
    kbArray.push([
      callbackButton(
        i18n.t(`${emoji} Сделать главным`),
        urlapi.format({ pathname, query, })
      ),
    ]);
  }

  {
    let emoji = '☑️';
    const is_proxy = accInfo.voter_info && accInfo.voter_info.is_proxy;
    if (is_proxy) emoji = '✅';
    const pathname = `${c.accountL3}/set_proxy`;
    const query = { ts, a, };
    kbArray.push([
      callbackButton(i18n.t(`${emoji} Proxy`), urlapi.format({ pathname, query, })),
    ]);
  }

  {
    let emoji = '☑️';
    const is_active = prodInfo.is_active ? prodInfo.is_active : false;
    if (is_active) emoji = '✅';
    const pathname = `${c.accountL3}/${is_active ? 'unregprod' : 'regprod'}`;
    const query = { ts, a, };
    kbArray.push([
      callbackButton(i18n.t(`${emoji} Производитель блоков`), urlapi.format({ pathname, query, })),
    ]);
  }

  kbArray.push([
    callbackButton(
      i18n.t('Back'),
      urlapi.format({ pathname: c.accountL3, query: { ts, a, }, }),
    ),
  ]);
  return inlineKeyboard(kbArray);
}



const kbMenuAccountRegProducerCancelGenerate = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel')),
    button(ctx.i18n.t('Generate Keys'))
  ];
  return keyboard(kbArray).resize();
}

module.exports = {
  ikbMenuAccounts,
  ikbMenuAccount,
  kbMenuAccountRegProducerCancelGenerate,
};

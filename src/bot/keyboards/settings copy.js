const Base58 = require('base58');
const {
  keyboard, inlineKeyboard,
  button, urlButton, callbackButton,
  contactRequestButton, locationRequestButton,
  switchToChatButton, switchToCurrentChatButton,
  gameButton, payButton, loginButton,
} = require('telegraf/markup');
const urlapi = require('url');
const querystring = require('querystring');
const { c } = require('../default-data');



const ikbMenuSettings = (ctx) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, session } = ctx;
  let kbArray = [];

  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Language'),
      urlapi.format({ pathname: `${c.settingsL3}/language`, }),
    ),
    callbackButton(
      i18n.t('ikb.Settings.Cryptocurrency Rate', { cryptocurrency_symbol: 'BTC' }),
      urlapi.format({ pathname: `${c.settingsL3}/rate`, }),
    )
  ]);
  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Currency'),
      urlapi.format({ pathname: `${c.settingsL3}/currency`, }),
    ),
    callbackButton(
      i18n.t('ikb.Settings.Change public name'),
      urlapi.format({ pathname: `${c.settingsL3}/public_name`, }),
      (session.user.public_name_locked) ? true : false,
    ),
  ]);

  const emoji = session.user.save_payment_details ? '🎾' : '⚪️';
  kbArray.push([
    callbackButton(
      `${i18n.t('ikb.Settings.Favorite addresses')}`,
      urlapi.format({ pathname: `${c.settingsL3}/favorite_addresses`, }),
    ),
    callbackButton(
      `${emoji} ${i18n.t('ikb.Settings.Save payment details')}`,
      urlapi.format({ pathname: `${c.settingsL3}/save_payment_details`, }),
    )
  ]);
  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Time zone'),
      urlapi.format({ pathname: `${c.settingsL3}/tz`, }),
    ),
    callbackButton(
      i18n.t('ikb.Settings.Notification settings'),
      urlapi.format({ pathname: `${c.settingsL3}/notification`, }),
    )
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettings = ikbMenuSettings;


const ikbMenuSettingsLanguage = async (ctx, params = { limit: 20, offset: 0 }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, db } = ctx;
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
            pathname: `${c.settingsL3}/language`,
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
        pathname: `${c.settingsL3}/language`,
        query: { l: data.limit, o: offset_prev, },
      }),
      pages_total === 1,
    ),
    callbackButton(
      i18n.t('ikb.Back.Back'),
      urlapi.format({ pathname: `${c.settingsL3}` }),
    ),
    callbackButton(
      `${page_next}/${pages_total}`,
      urlapi.format({
        pathname: `${c.settingsL3}/language`,
        query: { l: data.limit, o: offset_next, },
      }),
      pages_total === 1,
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsLanguage = ikbMenuSettingsLanguage;


const ikbMenuSettingsCurrency = async (ctx, params = { limit: 20, offset: 0 }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, db } = ctx;
  let kbArray = [];
  const maxInRow = 4;
  let row = [];

  const data = await db.getCurrenciesSortedList({
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
          data.list[i].code,
          urlapi.format({
            pathname: `${c.settingsL3}/currency`,
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
        pathname: `${c.settingsL3}/currency`,
        query: { l: data.limit, o: offset_prev, },
      }),
      pages_total === 1,
    ),
    callbackButton(
      (pages_total === 1) ? i18n.t('ikb.Settings.Back to settings') : i18n.t('ikb.Back.Back'),
      urlapi.format({ pathname: `${c.settingsL3}` }),
    ),
    callbackButton(
      `${page_next}/${pages_total}`,
      urlapi.format({
        pathname: `${c.settingsL3}/currency`,
        query: { l: data.limit, o: offset_next, },
      }),
      pages_total === 1,
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsCurrency = ikbMenuSettingsCurrency;


const ikbMenuToSettingsCurrency = (ctx) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n } = ctx;
  let kbArray = [];
  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Currency'),
      urlapi.format({ pathname: `${c.settingsL3}/currency` }),
    ),
  ]);
  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuToSettingsCurrency = ikbMenuToSettingsCurrency;


const ikbMenuSettingsRate = (ctx, params = { list: null, }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, session, } = ctx;
  let kbArray = [];
  const maxInRow = 1;
  let row = [];

  const base_currency = session.user.currency;
  const market_currency = 'BTC';
  const pair = `${market_currency}/${base_currency}`;
  const market_name = `${market_currency}_${base_currency}`;

  const list = params.list;
  for (let i in list) {
    if (row.length >= maxInRow) {
      kbArray.push(row);
      row = [];
    }
    if (list[i].visible) {
      const text = `${list[i].source.name} (${list[i].value} ${list[i].base_currency})`;
      const data = urlapi.format({
        pathname: `${c.settingsL3}/rate`,
        query: { id: list[i].source._id, market: market_name, ts: ts, }
      });
      row.push(callbackButton(text, data, !list[i].visible));
    }
  }
  if (row.length > 0) {
    kbArray.push(row);
    row = [];
  }

  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Back to settings'),
      urlapi.format({ pathname: `${c.settingsL3}` }),
    )
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsRate = ikbMenuSettingsRate;


const ikbMenuSettingsFavoriteAddresses = (ctx, params = { list: null, }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, } = ctx;
  let kbArray = [];
  const maxInRow = 1;
  let row = [];
  const list = params.list;
  for (let i in list) {
    if (row.length >= maxInRow) {
      kbArray.push(row);
      row = [];
    }
    if (list[i].visible) { // !?! 
      const text = `${list[i].source.name} (${list[i].value})`;
      const data = urlapi.format({
        pathname: `${c.settingsL3}/rate`,
        query: { code: list[i].source._id, }
      });
      row.push(callbackButton(text, data/*, !list[i].visible*/));
    }
  }
  if (row.length > 0) {
    kbArray.push(row);
    row = [];
  }

  kbArray.push([
    callbackButton(
      i18n.t('ikb.Settings.Add address'),
      urlapi.format({ pathname: `${c.settingsL3}/favorite_addresses/add` }),
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsFavoriteAddresses = ikbMenuSettingsFavoriteAddresses;


const ikbMenuSettingsTimeZone = async (ctx, params = { limit: 20, offset: 0 }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, db } = ctx;
  let kbArray = [];
  const maxInRow = 2;
  let row = [];

  const data = await db.getTimeZonesSortedList({
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
          `${data.list[i].name}`,
          urlapi.format({
            pathname: `${c.settingsL3}/tz`,
            query: { id: data.list[i].id, l: data.limit, o: data.offset, },
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
        pathname: `${c.settingsL3}/tz`,
        query: { l: data.limit, o: offset_prev, },
      }),
      pages_total === 1,
    ),
    callbackButton(
      (pages_total === 1) ? i18n.t('ikb.Settings.Back to settings') : i18n.t('ikb.Back.Back'),
      urlapi.format({ pathname: `${c.settingsL3}` }),
    ),
    callbackButton(
      `${page_next}/${pages_total}`,
      urlapi.format({
        pathname: `${c.settingsL3}/tz`,
        query: { l: data.limit, o: offset_next, },
      }),
      pages_total === 1,
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsTimeZone = ikbMenuSettingsTimeZone;


const ikbMenuSettingsNotification = (ctx) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, session } = ctx;
  let kbArray = [];

  kbArray.push([
    callbackButton(
      `👶 ${i18n.t('ikb.Settings.Notifications.New referrals')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: 'new_referral' },
      }),
    ),
    callbackButton(
      `💵 ${i18n.t('ikb.Settings.Notifications.Referal Payments')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: 'referal_payment' },
      }),
    ),
  ]);

  kbArray.push([
    callbackButton(
      `💸 ${i18n.t('ikb.Settings.Notifications.Free trades')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: 'free_trade' },
      }),
    ),
  ]);

  kbArray.push([
    callbackButton(
      `${i18n.t('ikb.Settings.Notifications.Service messages')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: 'service_message' },
      }),
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsNotification = ikbMenuSettingsNotification;


const ikbMenuSettingsNotificationChangeMode = async (ctx, params = { type }) => {
  const ts = Base58.int_to_base58(Math.round(new Date().getTime() / 1000)); //3pXYsw
  const { i18n, db } = ctx;
  let kbArray = [];

  kbArray.push([
    callbackButton(
      `🔔 ${i18n.t('ikb.Settings.Notifications.Receive silent notifications')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: params.type, mode: 'silent', },
      }),
    ),
  ]);

  kbArray.push([
    callbackButton(
      `😴 ${i18n.t('ikb.Settings.Notifications.Do not receive at nigth')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: params.type, mode: 'night', },
      }),
    ),
  ]);

  kbArray.push([
    callbackButton(
      `🔕 ${i18n.t('ikb.Settings.Notifications.Do not receive notifications')}`,
      urlapi.format({
        pathname: `${c.settingsL3}/notification`,
        query: { id: params.type, mode: 'enabled', },
      }),
    ),
  ]);

  kbArray.push([
    callbackButton(
      i18n.t('ikb.Back.Back'),
      urlapi.format({ pathname: `${c.settingsL3}/notification` }),
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenuSettingsNotificationChangeMode = ikbMenuSettingsNotificationChangeMode;

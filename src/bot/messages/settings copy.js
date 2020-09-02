const Handlebars = require('handlebars');
const dd = require('../default-data');


const hbsMsgMenuSettingsEN = `
🛠 <b>Settings</b>

What do you want to change?

⚠️ Showing Telegram username is not recommended and is only available to experienced users due to possible fraud.

<b>Your username:</b> /u{{public_name}}.`;
const hbsMsgMenuSettingsRU = `
🛠 <b>Настройки</b>

Что Вы хотите изменить?

⚠️ Отображение Telegram логина не рекомендуется и доступно только для опытных пользователей в связи с возможным мошенничеством. 

<b>Текущий логин:</b> /u{{public_name}}.`;
const msgMenuSettings = (ctx) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsRU;
      break;
  }
  const template = Handlebars.compile(hbsText);

  const public_name = session.user.public_name;
  return template({ public_name, });
}
module.exports.msgMenuSettings = msgMenuSettings;


const hbsMsgMenuSettingsCurrentCurrencyEN = `
💵 <b>Currency</b>

Select a currency. This filter affects the viewing and creating adverts.

Currently «<b>{{currency_code}}</b>» is being used.`;
const hbsMsgMenuSettingsCurrentCurrencyRU = `
💵 <b>Валюта</b>

Выберите валюту. Этот фильтр влияет на просмотр и создание объявлений.

Сейчас используется «<b>{{currency_code}}</b>».`;
const msgMenuSettingsCurrentCurrency = (ctx) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsCurrentCurrencyEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsCurrentCurrencyRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  const currency_code = session.user.currency;
  return template({ currency_code });
}
module.exports.msgMenuSettingsCurrentCurrency = msgMenuSettingsCurrentCurrency;



const hbsMsgMenuSettingsAboutCurrentCurrencyEN = hbsMsgMenuSettingsCurrentCurrencyEN + `

You can change it at any time in "Settings".`;
const hbsMsgMenuSettingsAboutCurrentCurrencyRU = hbsMsgMenuSettingsCurrentCurrencyRU + `

Вы можете менять этот параметр в любое время в разделе "Настройки".`;
const msgMenuSettingsAboutCurrentCurrency = (ctx) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsAboutCurrentCurrencyEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsAboutCurrentCurrencyRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  const title = i18n.t('ikb.Settings.Currency');
  const currency_code = session.user.currency_code;
  return template({ title, currency_code });
}
module.exports.msgMenuSettingsAboutCurrentCurrency = msgMenuSettingsAboutCurrentCurrency;


const hbsMsgMenuSettingsLanguageEN = `
🌍 <b>Language</b>

Choose the interface language. The change of language will not affect previously sent messages.`;
const hbsMsgMenuSettingsLanguageRU = `
🌍 <b>Язык</b>

Выберите язык интерфейса. Смена языка не повлияет на отправленные ранее сообщения.`;
const msgMenuSettingsLanguage = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsLanguageEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsLanguageRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsLanguage = msgMenuSettingsLanguage;


const hbsMsgMenuSettingsPublicNameChangeEN = `
👤 <b>Enter your Username</b>

ENG only and no more than 15 characters

⚠️ Attention! This action is irreversible. You will not be able to change it in the future.`;
const hbsMsgMenuSettingsPublicNameChangeRU = `
👤 <b>Укажите Имя Пользователя</b>

Только ENG и не более 15 символов

⚠️ Внимание! Данное действие необратимо. Вы не сможете менять Имя Пользователя в будущем.`;
const msgMenuSettingsPublicNameChange = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsPublicNameChangeEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsPublicNameChangeRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsPublicNameChange = msgMenuSettingsPublicNameChange;


const hbsMsgMenuSettingsPublicNameChangeQuestionEN = `
Are you sure you want to change Public name to {{public_name}}?`;
const hbsMsgMenuSettingsPublicNameChangeQuestionRU = `
Вы уверены что хотите сменить имя пользователя на {{public_name}}?`;
const msgMenuSettingsPublicNameChangeQuestion = (ctx, data = {}) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsPublicNameChangeQuestionEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsPublicNameChangeQuestionRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ public_name: data.public_name });
}
module.exports.msgMenuSettingsPublicNameChangeQuestion = msgMenuSettingsPublicNameChangeQuestion;


const hbsMsgMenuSettingsPublicNameChangeWrongEN = `
⚠️ Wrong public Username`;
const hbsMsgMenuSettingsPublicNameChangeWrongRU = `
⚠️ Не верное Имя Пользователя`;
const msgMenuSettingsPublicNameChangeWrong = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsPublicNameChangeWrongEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsPublicNameChangeWrongRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsPublicNameChangeWrong = msgMenuSettingsPublicNameChangeWrong;


const hbsMsgMenuSettingsPublicNameChangeSuccessfulEN = `
Public name has been successfully saved`;
const hbsMsgMenuSettingsPublicNameChangeSuccessfulRU = `
Имя Пользователя успешно сохранено`;
const msgMenuSettingsPublicNameChangeSuccessful = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsPublicNameChangeSuccessfulEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsPublicNameChangeSuccessfulRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsPublicNameChangeSuccessful = msgMenuSettingsPublicNameChangeSuccessful;


const hbsMsgMenuSettingsRateEN = `
📊 <b>Rate {{market_currency}}</b>

Select the source of exchange rate of <b>{{pair}}</b> pair. Notice, that changes will impact on all your adverts with floating price.

Current source: {{source_name}}`;
const hbsMsgMenuSettingsRateRU = `
📊 <b>Курс {{market_currency}}</b>

Выберите источник актуального курса для пары <b>{{pair}}</b>. Учтите, что изменения будут применены к вашим объявлениям с плавающей ценой.

Текущий источник: {{source_name}}`;
const msgMenuSettingsRate = async (ctx) => {
  const { i18n, session, db } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsRateEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsRateRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  const base_currency = session.user.currency;
  const market_currency = 'BTC';
  const pair = `${market_currency}/${base_currency}`;
  const market_name = `${market_currency}_${base_currency}`;
  const source_id = (session.user.rate.get(market_name) === undefined)
    ? session.user.rate.get('DEFAULT')
    : session.user.rate.get(market_name);
  const source = await db.getRateSourceById(source_id);
  const source_name = source.name;
  return template({ market_currency, pair, source_name, });
}
module.exports.msgMenuSettingsRate = msgMenuSettingsRate;


const hbsMsgMenuSettingsFavoriteAddressesEN = `
⭐️ <b>Favorite addresses</b>

You can add your favorite wallet addresses for quick access when withdrawing funds!`;
const hbsMsgMenuSettingsFavoriteAddressesRU = `
⭐️ <b>Избранные адреса</b>

Вы можете добавить избранные адреса кошельков для быстрого доступа при выводе средств!`;
const msgMenuSettingsFavoriteAddresses = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsFavoriteAddressesEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsFavoriteAddressesRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsFavoriteAddresses = msgMenuSettingsFavoriteAddresses;


const hbsMsgMenuSettingsFavoriteAddressesAddEnterNameEN = `
Enter name for favorite address. No more than 10 characters`;
const hbsMsgMenuSettingsFavoriteAddressesAddEnterNameRU = `
Введите название избранного адреса. Не более 10 символов`;
const msgMenuSettingsFavoriteAddressesAddEnterName = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsFavoriteAddressesAddEnterNameEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsFavoriteAddressesAddEnterNameRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsFavoriteAddressesAddEnterName = msgMenuSettingsFavoriteAddressesAddEnterName;


const hbsMsgMenuSettingsTimeZoneEN = `
💵 <b>Time zone</b>

Select your Time zone. This setting affects notitications and date/time representation.

{{#if time_zone}}
Currently «<b>{{time_zone}}</b>» is being used.
{{/if}}`;
const hbsMsgMenuSettingsTimeZoneRU = `
💵 <b>Часовой пояс</b>

Выберите свой часовой пояс. Эта настройка влияет на получение уведомлений, а также на отображение даты и времени в сервисе.

{{#if time_zone}}
Сейчас используется «<b>{{time_zone}}</b>».
{{/if}}`;
const msgMenuSettingsTimeZone = (ctx) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsTimeZoneEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsTimeZoneRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  const time_zone = session.user.timezone;
  return template({ time_zone });
}
module.exports.msgMenuSettingsTimeZone = msgMenuSettingsTimeZone;


const hbsMsgMenuSettingsNotificationEN = `
📲 You can set up notifications for different events`;
const hbsMsgMenuSettingsNotificationRU = `
📲 Тут вы можете настривать уведомления о новых событиях под себя`;
const msgMenuSettingsNotification = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgMenuSettingsNotificationEN;
      break;
    case 'ru':
      hbsText = hbsMsgMenuSettingsNotificationRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}
module.exports.msgMenuSettingsNotification = msgMenuSettingsNotification;


const hbsMsgMenuSettingsNotificationChangeModeTypeNewReferralEN = `
🔊 Notifications of new referrals after the user has registered in the service by your referral link.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeNewReferralRU = `
🔊 Уведомления о новых рефералах после того как пользователь зарегистрировался в сервисе по вашей реферальной ссылке.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeReferalPaymentEN = `
🔊 Payout notifications after the user has completed a trade.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeReferalPaymentRU = `
🔊 Уведомления о выплатах после того как пользователь провел сделку.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeFreeTradeEN = `
🔊 Notification that your trade was free and the commission has returned to the balance.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeFreeTradeRU = `
🔊 Уведомление о том, что ваша сделка прошла бесплатно и комиссия вернулась на баланс.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeServiceMessageEN = `
🤖 Very rare, but sometimes {{company_name}} sends important messages to users, but we value the comfort of users more, so you can change the settings for receiving such messages.`;
const hbsMsgMenuSettingsNotificationChangeModeTypeServiceMessageRU = `
🤖 {{company_name}} очень редко, но рассылает сообщения с важнейшей информацией по пользователям, но комфорт пользователей мы ценим больше, поэтому вы можете изменить настройки получения таких сообщений.`;
const hbsMsgMenuSettingsNotificationChangeModeEN = `
{{type}}

Night time is from 11PM to 9AM according to your local time.

Mode:
<b>{{mode}}</b>`;
const hbsMsgMenuSettingsNotificationChangeModeRU = `
{{type}}

Ночное время — это с 23 до 9 по вашему локальному времени

Режим:
<b>{{mode}}</b>`;
const msgMenuSettingsNotificationChangeMode = (ctx, params = { type }) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  let type = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      switch (params.type) {
        case 'new_referral':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeNewReferralEN;
          break;
        case 'referal_payment':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeReferalPaymentEN;
          break;
        case 'free_trade':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeFreeTradeEN;
          break;
        case 'service_message':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeServiceMessageEN;
          break;
      }
      hbsText = hbsMsgMenuSettingsNotificationChangeModeEN;
      break;
    case 'ru':
      switch (params.type) {
        case 'new_referral':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeNewReferralRU;
          break;
        case 'referal_payment':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeReferalPaymentRU;
          break;
        case 'free_trade':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeFreeTradeRU;
          break;
        case 'service_message':
          type = hbsMsgMenuSettingsNotificationChangeModeTypeServiceMessageRU;
          break;
      }
      hbsText = hbsMsgMenuSettingsNotificationChangeModeRU;
      break;
  }
  let mode = '';
  const enabled = session.user.notification[params.type].enabled;
  const silent = session.user.notification[params.type].mode.silent;
  const night = session.user.notification[params.type].mode.night;
  if (enabled) {
    if (silent && night) {
      mode = `${i18n.t('ikb.Settings.Notifications.modes.Do not receive at night')}`;
      mode += `, ${i18n.t('ikb.Settings.Notifications.modes.Silent')}`;
    } else if (silent) {
      mode = `${i18n.t('ikb.Settings.Notifications.modes.Silent')}`;
    } else if (night) {
      mode = `${i18n.t('ikb.Settings.Notifications.modes.Do not receive at night')}`;
    } else
      mode = `${i18n.t('ikb.Settings.Notifications.modes.Enabled')}`;
  } else
    mode = `${i18n.t('ikb.Settings.Notifications.modes.Disabled')}`;

  const template = Handlebars.compile(hbsText);
  return template({
    type, mode,
    company_name: dd.company.name,
  });
}
module.exports.msgMenuSettingsNotificationChangeMode = msgMenuSettingsNotificationChangeMode;

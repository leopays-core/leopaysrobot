const Handlebars = require('handlebars');
const settings = require('../../../settings');



const hbsMsgMenuSettingsEN = `
🛠 <b>Settings</b>

What do you want to change?

<b>Your username:</b> /u_{{public_name}}.
`;
// ⚠️ Showing Telegram username is not recommended and is only available to experienced users.
const hbsMsgMenuSettingsRU = `
🛠 <b>Настройки</b>

Что Вы хотите изменить?

<b>Текущий логин:</b> /u_{{public_name}}.
`;
// ⚠️ Отображение Telegram логина не рекомендуется и доступно только для опытных пользователей.
const msgMenuSettings = (ctx) => {
  const { i18n, session } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuSettingsEN; break;
    case 'ru': hbsText = hbsMsgMenuSettingsRU; break;
  }
  const template = Handlebars.compile(hbsText);

  const public_name = session.user.public_name;
  return template({ public_name, });
}


const hbsMsgMenuSettingsLanguageEN = `
🌍 <b>Language</b>

Choose the interface language. The change of language will not affect previously sent messages.
`;
const hbsMsgMenuSettingsLanguageRU = `
🌍 <b>Язык</b>

Выберите язык интерфейса. Смена языка не повлияет на отправленные ранее сообщения.
`;
const msgMenuSettingsLanguage = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuSettingsLanguageEN; break;
    case 'ru': hbsText = hbsMsgMenuSettingsLanguageRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


module.exports = {
  msgMenuSettingsLanguage,
  msgMenuSettings,
};

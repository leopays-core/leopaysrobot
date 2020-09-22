const {
  keyboard, inlineKeyboard,
  button, urlButton, callbackButton,
  contactRequestButton, locationRequestButton,
  switchToChatButton, switchToCurrentChatButton,
  gameButton, payButton, loginButton,
} = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const settings = require('../../../settings');



const ikbMenu = (ctx) => {
  const { i18n } = ctx;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));
  const kbArray = [];

  const visible = true;
  const data = true;

  const pathname = 'pathname/';
  const query = { ts: ts, data, };

  kbArray.push([
    callbackButton(
      i18n.t('Text'),
      urlapi.format({ pathname, query, }),
      !visible
    ),
  ]);

  return inlineKeyboard(kbArray);
}
module.exports.ikbMenu = ikbMenu;

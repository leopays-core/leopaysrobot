const Handlebars = require('handlebars');
const aboutMessages = require('./about');
const accountMessages = require('./account');
const affiliateMessages = require('./affiliate');
const settingsMessages = require('./settings');
const walletMessages = require('./wallet');
const settings = require('../../../settings');



const hbsMsgAgreeTermsOfServiceEN = `
Are you confirm that you read and agree <a href="{{law_documents_url}}">terms of service</a>?
Please click on the button below to confirm.`;
const hbsMsgAgreeTermsOfServiceRU = `
Вы подтверждаете, что ознакомились и согласны с <a href="{{law_documents_url}}">условиями предоставления услуг</a>?
Пожалуйста, нажмите на кнопку внизу чтобы подтвердить.`;
const msgAgreeTermsOfService = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgAgreeTermsOfServiceEN; break;
    case 'ru': hbsText = hbsMsgAgreeTermsOfServiceRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ law_documents_url: '/terms', });
}


const hbsMsgNewReferalEN = `
You have got a new referal /u_{{public_name}}`;
const hbsMsgNewReferalRU = `
У Вас новый реферал /u_{{public_name}}`;
const msgNewReferal = (ctx, data) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgNewReferalEN; break;
    case 'ru': hbsText = hbsMsgNewReferalRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const public_name = data.public_name;
  return template({ public_name });
}


const hbsMsgShortInfoEN = `
<b>{{bot_username}}</b>`;
const hbsMsgShortInfoRU = `
<b>{{bot_username}}</b>`;
const msgShortInfo = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  let bot_username = 'LeoPaysRoBot';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgShortInfoEN; break;
    case 'ru': hbsText = hbsMsgShortInfoRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const company_name = 'LeoPays';
  const company_url = 'https://leopays.com/';
  return template({
    bot_username,
    company_name, company_url,
  });
}


const hbsMsgGreetingEN = `
<b>Hello, {{user_first_name}}!</b>

This telegram bot is a part of <a href="{{company_url}}">{{company_name}}</a>!
`;
const hbsMsgGreetingRU = `
<b>Приветствую, {{user_first_name}}!</b>

Это телеграм бот <a href="{{company_url}}">{{company_name}}</a>!
`;
const msgGreeting = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgGreetingEN; break;
    case 'ru': hbsText = hbsMsgGreetingRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const user_first_name = ctx.chat.first_name;
  const company_name = 'LeoPays';
  const company_url = 'https://leopays.com/';
  return template({
    user_first_name,
    company_name, company_url,
  });
}


const hbsMsgWrongCommandEN = `
⚠️ <b>Attention, the wrong command was most likely entered!</b>
`;
const hbsMsgWrongCommandRU = `
⚠️ <b>Внимание, вероятнее всего, была введена неверная команда!</b>`;
const msgWrongCommand = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en':
      hbsText = hbsMsgWrongCommandEN;
      break;
    case 'ru':
      hbsText = hbsMsgWrongCommandRU;
      break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgOhSorryEN = `Oh, sorry 😕`;
const hbsMsgOhSorryRU = `Ой, извините 😕`;
const msgOhSorry = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgOhSorryEN; break;
    case 'ru': hbsText = hbsMsgOhSorryRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgCancelledEN = `<b>Cancelled</b>`;
const hbsMsgCancelledRU = `<b>Отменено</b>`;
const msgCancelled = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgCancelledEN; break;
    case 'ru': hbsText = hbsMsgCancelledRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgMenuTransactionEN = `
<b>Done!</b>
Transaction: {{transaction_id}}
`;
const hbsMsgMenuTransactionRU = `
<b>Готово!</b>
Транзакция: {{transaction_id}}
`;
const msgMenuTransaction = (ctx, transaction) => {
  const { i18n } = ctx;
  const { explorer } = settings;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuTransactionEN; break;
    case 'ru': hbsText = hbsMsgMenuTransactionRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...transaction, });
}


const hbsMsgMenuSelecAccountEN = `
<b>Selec Account</b>
`;
const hbsMsgMenuSelecAccountRU = `
<b>Выберите аккаунт</b>
`;
const msgMenuSelecAccount = (ctx, transaction) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuSelecAccountEN; break;
    case 'ru': hbsText = hbsMsgMenuSelecAccountRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}

module.exports = {
  msgMenuSelecAccount,
  msgMenuTransaction,
  msgAgreeTermsOfService,
  msgNewReferal,
  msgShortInfo,
  msgGreeting,
  msgWrongCommand,
  msgOhSorry,
  msgCancelled,
  ...aboutMessages,
  ...accountMessages,
  ...affiliateMessages,
  ...settingsMessages,
  ...walletMessages,
};

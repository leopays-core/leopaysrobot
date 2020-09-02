const Handlebars = require('handlebars');
const aboutMessages = require('./about');
const accountMessages = require('./account');
const affiliateMessages = require('./affiliate');
const settingsMessages = require('./settings');
const walletMessages = require('./wallet');
const settings = require('../../../settings');



const hbsMsgAgreeTermsOfServiceEN = `
Are you confirm that you read and agree <a href="{{law_documents_url}}">terms of service</a>?
Please click on the button below to confirm.
`;
const hbsMsgAgreeTermsOfServiceRU = `
Вы подтверждаете, что ознакомились и согласны с <a href="{{law_documents_url}}">условиями предоставления услуг</a>?
Пожалуйста, нажмите на кнопку внизу чтобы подтвердить.
`;
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
You have got a new referal /u_{{public_name}}
`;
const hbsMsgNewReferalRU = `
У Вас новый реферал /u_{{public_name}}
`;
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
<b>{{bot_username}}</b>
`;
const hbsMsgShortInfoRU = `
<b>{{bot_username}}</b>
`;
const msgShortInfo = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  let bot_username = 'LeoPaysRoBot';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgShortInfoEN; break;
    case 'ru': hbsText = hbsMsgShortInfoRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({
    bot_username,
  });
}


const hbsMsgGreetingEN = `
<b>Hello, {{user_first_name}}!</b>

This telegram bot is a part of <a href="{{company_url}}">{{company_name}}</a>!
`;
const hbsMsgGreetingRU = `
<b>Приветствую, {{user_first_name}}!</b>

Это телеграм бот часть <a href="{{company_url}}">{{company_name}}</a>!
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
⚠️ <b>Внимание, вероятнее всего, была введена неверная команда!</b>
`;
const msgWrongCommand = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgWrongCommandEN; break;
    case 'ru': hbsText = hbsMsgWrongCommandRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgOhSorryEN = `
Oh, sorry 😕
`;
const hbsMsgOhSorryRU = `
Ой, извините 😕
`;
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


const hbsMsgCancelledEN = `
<b>Cancelled</b>
`;
const hbsMsgCancelledRU = `
<b>Отменено</b>
`;
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
<b>Select an account</b>
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


const hbsMsgSendingTheTransactionEN = `
Sending the transaction
`;
const hbsMsgSendingTheTransactionRU = `
Отправка транзакции
`;
const msgSendingTheTransaction = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSendingTheTransactionEN; break;
    case 'ru': hbsText = hbsMsgSendingTheTransactionRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectAccountForClaimRewardsEN = `
Select the account for which you want to claim rewards
`;
const hbsMsgSelectAccountForClaimRewardsRU = `
Выберите аккаунт для которого вы хотите получить вознаграждения
`;
const msgSelectAccountForClaimRewards = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectAccountForClaimRewardsEN; break;
    case 'ru': hbsText = hbsMsgSelectAccountForClaimRewardsRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgErrorInTheAccountCreationEN = `
Error in the LeoPays account creation process
`;
const hbsMsgErrorInTheAccountCreationRU = `
Ошибка в процессе создания аккаунта LeoPays
`;
const msgErrorInTheAccountCreation = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgErrorInTheAccountCreationEN; break;
    case 'ru': hbsText = hbsMsgErrorInTheAccountCreationRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgInvalidAccountNameEN = `
Invalid LeoPays account name
`;
const hbsMsgInvalidAccountNameRU = `
Неверное имя аккаунта LeoPays
`;
const msgInvalidAccountName = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgInvalidAccountNameEN; break;
    case 'ru': hbsText = hbsMsgInvalidAccountNameRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgAccountCreationStartedEN = `
Account creation started LeoPays account
`;
const hbsMsgAccountCreationStartedRU = `
Запущено создание аккаунта LeoPays
`;
const msgAccountCreationStarted = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgAccountCreationStartedEN; break;
    case 'ru': hbsText = hbsMsgAccountCreationStartedRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgThisAccountAlreadyTakenEN = `
This LeoPays account is already taken. Try another name.
`;
const hbsMsgThisAccountAlreadyTakenRU = `
Этот аккаунт LeoPays уже занят. Попробуйте другое имя.
`;
const msgThisAccountAlreadyTaken = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgThisAccountAlreadyTakenEN; break;
    case 'ru': hbsText = hbsMsgThisAccountAlreadyTakenRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectFromAccountToSendCoinsEN = `
Select the LeoPays account from which you want to send coins
`;
const hbsMsgSelectFromAccountToSendCoinsRU = `
Выберите аккаунт LeoPays с которого вы хотите отправить монеты
`;
const msgSelectFromAccountToSendCoins = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectFromAccountToSendCoinsEN; break;
    case 'ru': hbsText = hbsMsgSelectFromAccountToSendCoinsRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectToAccountToSendCoinsEN = `
Specify the LeoPays account to which you want to send coins
`;
const hbsMsgSelectToAccountToSendCoinsRU = `
Укажите аккаунт LeoPays на который вы хотите отправить монеты
`;
const msgSelectToAccountToSendCoins = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectToAccountToSendCoinsEN; break;
    case 'ru': hbsText = hbsMsgSelectToAccountToSendCoinsRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSpecifyTheNumberOfLPCToSendEN = `
Specify the number of LPC you want to send by number.
`;
const hbsMsgSpecifyTheNumberOfLPCToSendRU = `
Укажите числом количество LPC которое вы хотите отправить.
`;
const msgSpecifyTheNumberOfLPCToSend = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSpecifyTheNumberOfLPCToSendEN; break;
    case 'ru': hbsText = hbsMsgSpecifyTheNumberOfLPCToSendRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgAvailableToYouEN = `
Available to you
`;
const hbsMsgAvailableToYouRU = `
Вам доступно
`;
const msgAvailableToYou = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgAvailableToYouEN; break;
    case 'ru': hbsText = hbsMsgAvailableToYouRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgFillInTheMemoFieldEN = `
Fill in the "memo" field (English letters and numbers only) or click "Skip".
`;
const hbsMsgFillInTheMemoFieldRU = `
Укажите данные в поле "memo" (Только английские буквы и цифры) или нажмите "Пропустить".
`;
const msgFillInTheMemoField = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgFillInTheMemoFieldEN; break;
    case 'ru': hbsText = hbsMsgFillInTheMemoFieldRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectFromAccountToStakeEN = `
Select the LeoPays account you want to stake from
`;
const hbsMsgSelectFromAccountToStakeRU = `
Выберите аккаунт LeoPays с которого вы хотите застейковать
`;
const msgSelectFromAccountToStake = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectFromAccountToStakeEN; break;
    case 'ru': hbsText = hbsMsgSelectFromAccountToStakeRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSpecifyTheNumberOfLPCToStakeEN = `
Enter the number of LPC that you want to stake
`;
const hbsMsgSpecifyTheNumberOfLPCToStakeRU = `
Укажите числом количество LPC которое вы хотите застейковать
`;
const msgSpecifyTheNumberOfLPCToStake = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSpecifyTheNumberOfLPCToStakeEN; break;
    case 'ru': hbsText = hbsMsgSpecifyTheNumberOfLPCToStakeRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectFromAccountToVoteEN = `
Select the LeoPays account from which you want to vote.
`;
const hbsMsgSelectFromAccountToVoteRU = `
Выберите аккаунт LeoPays с которого вы хотите проголосовать.
`;
const msgSelectFromAccountToVote = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectFromAccountToVoteEN; break;
    case 'ru': hbsText = hbsMsgSelectFromAccountToVoteRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSelectProxyAccountToVoteEN = `
If you want to transfer your votes to control, then send a PROXY LeoPays account or click Skip.
`;
const hbsMsgSelectProxyAccountToVoteRU = `
Если вы хотите передать ваши голоса в управление то отправьте аккаунт LeoPays PROXY или нажмите Пропустить.
`;
const msgSelectProxyAccountToVote = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectProxyAccountToVoteEN; break;
    case 'ru': hbsText = hbsMsgSelectProxyAccountToVoteRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgListBPAccountsToVoteEN = `
List the LeoPays accounts of those block producers for which you want to vote or select from the menu.
`;
const hbsMsgListBPAccountsToVoteRU = `
Перечислите LeoPays аккаунты тех производителей блоков за которых вы хотите проголосовать или выберите в меню.
`;
const msgListBPAccountsToVote = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgListBPAccountsToVoteEN; break;
    case 'ru': hbsText = hbsMsgListBPAccountsToVoteRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgListOfBPEN = `
List of block producers
`;
const hbsMsgListOfBPRU = `
Список производителей блоков
`;
const msgListOfBP = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgListOfBPEN; break;
    case 'ru': hbsText = hbsMsgListOfBPRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgNoMoreThanMaxBPEN = `
No more than 30 block producers
`;
const hbsMsgNoMoreThanMaxBPRU = `
Не более 30 производителей блоков
`;
const msgNoMoreThanMaxBP = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgNoMoreThanMaxBPEN; break;
    case 'ru': hbsText = hbsMsgNoMoreThanMaxBPRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgSpecifyTheNumberOfLPCToDeStakeEN = `
Indicate the number of LPC you want to proof with a number.
`;
const hbsMsgSpecifyTheNumberOfLPCToDeStakeRU = `
Укажите числом количество LPC которое вы хотите расстейковать.
`;
const msgSpecifyTheNumberOfLPCToDeStake = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSpecifyTheNumberOfLPCToDeStakeEN; break;
    case 'ru': hbsText = hbsMsgSpecifyTheNumberOfLPCToDeStakeRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgUseTheseKeysToStartBlockProductionEN = `
Use these private and public keys with account {{account}} to start block production in lepays-node.
`;
const hbsMsgUseTheseKeysToStartBlockProductionRU = `
Используйте эти приватный и публичный ключи с аккаунтом {{account}} для запуска производства блоков в lepays-node.
`;
const msgUseTheseKeysToStartBlockProduction = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgUseTheseKeysToStartBlockProductionEN; break;
    case 'ru': hbsText = hbsMsgUseTheseKeysToStartBlockProductionRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


const hbsMsgSendTheAddressOfYourNodeEN = `
<b>Please send the address of your LeoPays node.</b>
Example: https://node.testnet.leopays.dev
`;
const hbsMsgSendTheAddressOfYourNodeRU = `
<b>Пришлите адрес вашего узла сети LeoPays.</b>
Пример: https://node.testnet.leopays.dev
`;
const msgSendTheAddressOfYourNode = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSendTheAddressOfYourNodeEN; break;
    case 'ru': hbsText = hbsMsgSendTheAddressOfYourNodeRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


const hbsMsgSendTheYourCountryCodeEN = `
<b>Please send your country code.</b>
According to ISO 3166, https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
Example for Russia: 643
`;
const hbsMsgSendTheYourCountryCodeRU = `
<b>Пришлите цифровой код вашей страны.</b>
Согласно ISO 3166, https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
Пример для России: 643
`;
const msgSendTheYourCountryCode = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSendTheYourCountryCodeEN; break;
    case 'ru': hbsText = hbsMsgSendTheYourCountryCodeRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


const hbsMsgSelectTheFromAccountToWithdrawFromRefundEN = `
Select the LeoPays account from which you want to withdraw funds from the refund.
`;
const hbsMsgSelectTheFromAccountToWithdrawFromRefundRU = `
Выберите LeoPays аккаунт с которого вы хотите забрать средства из возврата.
`;
const msgSelectTheFromAccountToWithdrawFromRefund = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgSelectTheFromAccountToWithdrawFromRefundEN; break;
    case 'ru': hbsText = hbsMsgSelectTheFromAccountToWithdrawFromRefundRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


const hbsMsgTooEarlyEN = `
<b>Too early!</b>
`;
const hbsMsgTooEarlyRU = `
<b>Слишком рано!</b>
`;
const msgTooEarly = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgTooEarlyEN; break;
    case 'ru': hbsText = hbsMsgTooEarlyRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


const hbsMsgFundsWillBeAvailableNoEarlierThanEN = `
Funds will be available no earlier than
`;
const hbsMsgFundsWillBeAvailableNoEarlierThanRU = `
Средства будут доступны не ранее
`;
const msgFundsWillBeAvailableNoEarlierThan = (ctx, params = { account: '' }) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgFundsWillBeAvailableNoEarlierThanEN; break;
    case 'ru': hbsText = hbsMsgFundsWillBeAvailableNoEarlierThanRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({ ...params });
}


module.exports = {
  msgFundsWillBeAvailableNoEarlierThan,
  msgTooEarly,
  msgSelectTheFromAccountToWithdrawFromRefund,
  msgSendTheYourCountryCode,
  msgSendTheAddressOfYourNode,
  msgUseTheseKeysToStartBlockProduction,
  msgSpecifyTheNumberOfLPCToDeStake,
  msgNoMoreThanMaxBP,
  msgListOfBP,
  msgListBPAccountsToVote,
  msgSelectProxyAccountToVote,
  msgSelectFromAccountToVote,
  msgSpecifyTheNumberOfLPCToStake,
  msgSelectFromAccountToStake,
  msgFillInTheMemoField,
  msgAvailableToYou,
  msgSpecifyTheNumberOfLPCToSend,
  msgSelectToAccountToSendCoins,
  msgSelectFromAccountToSendCoins,
  msgThisAccountAlreadyTaken,
  msgAccountCreationStarted,
  msgInvalidAccountName,
  msgErrorInTheAccountCreation,
  msgSelectAccountForClaimRewards,
  msgSendingTheTransaction,
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

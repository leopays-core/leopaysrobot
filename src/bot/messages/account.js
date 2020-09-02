const Handlebars = require('handlebars');
const settings = require('../../../settings');



const hbsMsgMenuAccountsEN = `
List of your accounts.
`;
const hbsMsgMenuAccountsRU = `
Список ваших аккаунтов.
`;
const msgMenuAccounts = (ctx) => {
  const { i18n } = ctx;
  const { company } = settings;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuAccountsEN; break;
    case 'ru': hbsText = hbsMsgMenuAccountsRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const company_url = company.url;
  const company_name = company.name;
  return template({
    company_url, company_name,
  });
}


const hbsMenuAccountCreateEN = `
👇 <b>Enter your new account name</b>
The account name must be 12 characters long (short names are played at the auction).
Use only uppercase English characters from the set 'a-z1-5'.
`;
const hbsMenuAccountCreateRU = `
👇 <b>Введите имя нового аккаунта</b>
Имя должно начинаться с буквы.
Длина имени аккаунта должна ровняться 12 символам (короткие имена разыгрываются на аукционе).
Используйте только прописные символы английского алфавита из набора 'a-z1-5'.
`;
const msgMenuAccountCreate = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMenuAccountCreateEN; break;
    case 'ru': hbsText = hbsMenuAccountCreateRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgMenuAccountEN = `
{{#if privileged}}👑{{else}}👤{{/if}} /a_{{accountName}}

<b>Creator</b>: /a_{{creator}}

<b>Resources</b>:
<b>RAM</b>: usage: {{ram_usage}} / quota:{{ram_quota}} Bytes
<b>NET</b>: used: {{net_limit.used}} / available: {{cpu_limit.available}} / max: {{cpu_limit.max}} Bytes
<b>CPU</b>: used: {{cpu_limit.used}} / available: {{cpu_limit.available}} / max: {{cpu_limit.max}} µs

{{#if voter_info}}
{{#if voter_info.is_proxy}}✅{{else}}☑️{{/if}} <b>Proxy</b>
{{#if voter_info.proxy}}<b>Proxied to</b>: {{voter_info.proxy}}{{/if}}
{{/if}}
{{#if prodInfo}}{{#if prodInfo.is_active}}✅{{else}}☑️{{/if}} <b>Block producer</b>{{/if}}
`;
const hbsMsgMenuAccountRU = `
{{#if privileged}}👑{{else}}👤{{/if}} /a_{{accountName}}

<b>Создатель</b>: /a_{{creator}}

<b>Ресурсы</b>:
<b>RAM</b>: usage: {{ram_usage}} / quota:{{ram_quota}} Bytes
<b>NET</b>: used: {{net_limit.used}} / available: {{cpu_limit.available}} / max: {{cpu_limit.max}} Bytes
<b>CPU</b>: used: {{cpu_limit.used}} / available: {{cpu_limit.available}} / max: {{cpu_limit.max}} µs

{{#if voter_info}}
{{#if voter_info.is_proxy}}✅{{else}}☑️{{/if}} <b>Proxy</b>
{{#if voter_info.proxy}}<b>Proxied to</b>: {{voter_info.proxy}}{{/if}}
{{/if}}
{{#if prodInfo}}{{#if prodInfo.is_active}}✅{{else}}☑️{{/if}} <b>Производитель блоков</b>{{/if}}
`;
const msgMenuAccount = (ctx, account, accInfo, prodInfo) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuAccountEN; break;
    case 'ru': hbsText = hbsMsgMenuAccountRU; break;
  }
  const template = Handlebars.compile(hbsText);
  let accountName = account;
  if (accountName.includes('.')) accountName = accountName.replace('.', '_');
  if (accInfo.creator.includes('.')) accInfo.creator = accInfo.creator.replace('.', '_');
  return template({
    ...accInfo, prodInfo, accountName,
  });
}


const hbsMsgMenuAccountSendPubKeyEN = `
<b>Send your LeoPays Public Key.</b>
LPC...
`;
const hbsMsgMenuAccountSendPubKeyRU = `
<b>Пришлите ваш публичный ключ LeoPays.</b>
LPC...
`;
const msgMenuAccountSendPubKey = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuAccountSendPubKeyEN; break;
    case 'ru': hbsText = hbsMsgMenuAccountSendPubKeyRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}

module.exports = {
  msgMenuAccounts,
  msgMenuAccountCreate,
  msgMenuAccount,
  msgMenuAccountSendPubKey,
};

const Handlebars = require('handlebars');
const settings = require('../../../settings');
const leopays = require('../../leopays');



const hbsMsgMenuWalletEN = `
💼 <b>Wallet</b>
{{#if accounts}}
{{#each balances}}

👤 /a_{{this.account}}
<b>Balance:</b> {{this.balance}}
<b>Refund:</b> {{this.refundsLPC}}{{#if this.refundsRequestTime}} by {{refundsRequestTime}}{{/if}}
<b>Stake:</b> {{this.staked}}
{{/each}}
{{else}}
⚠️ <b>Account not created!</b>
{{/if}}

🤝 <b>Invited:</b> {{referralsCount}} users
`;
const hbsMsgMenuWalletRU = `
💼 <b>Кошелёк</b>
{{#if accounts}}
{{#each balances}}

👤 /a_{{this.account}}
<b>Баланс:</b> {{this.balance}}
<b>Возврат:</b> {{this.refundsLPC}}{{#if this.refundsRequestTime}} до {{refundsRequestTime}}{{/if}}
<b>Застейкано:</b> {{this.staked}}
{{/each}}
{{else}}
⚠️ <b>Аккаунт не создан!</b>
{{/if}}

🤝 <b>Приглашено:</b> {{referralsCount}} пользователей
`;
const msgMenuWallet = async (ctx) => {
  const { i18n, session } = ctx;
  const { user } = session;

  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuWalletEN; break;
    case 'ru': hbsText = hbsMsgMenuWalletRU; break;
  }
  const template = Handlebars.compile(hbsText);

  const referralsCount = user.referrals.count;
  const referralsRevenue = user.referrals.revenue;

  const accounts = user.accounts;
  // pзагрузка балансов
  //const balance = available + staked;
  const balances = [];
  for (let i in accounts) {
    let refundsLPC = 0;
    let refundsRequestTime = '';
    const refunds = await leopays.rpc.get_table_rows({
      json: true, code: 'lpc', table: 'refunds', scope: accounts[i],
    });

    if (refunds.rows.length > 0) {
      refundsLPC += parseInt(
        parseFloat(refunds.rows[0].net_amount.split(' ')[0]) * 10000
        + parseFloat(refunds.rows[0].cpu_amount.split(' ')[0]) * 10000
      );
      const time = new Date(refunds.rows[0].request_time + 'Z').getTime();
      const claimTime = time + 3 * 24 * 60 * 60 * 1000;
      refundsRequestTime = new Date(claimTime).toUTCString();
    }
    const data = await leopays.rpc.get_currency_balance('lpc.token', accounts[i], 'LPC');
    const acc = await leopays.rpc.get_account(accounts[i]);

    balances.push({
      account: accounts[i],
      balance: acc.core_liquid_balance ? acc.core_liquid_balance : '0.0000 LPC',
      //equivalent: 0, available: 0,
      refundsLPC: `${(refundsLPC / 10000).toFixed(4)} LPC`,
      refundsRequestTime,
      staked: `${acc.voter_info ? ((acc.voter_info.staked) / 10000).toFixed(4) : 0.0000} LPC`,
      //currency_symbol: 'USDT', cryptocurrency_symbol: 'LPC',
    });
  }

  return template({
    accounts, balances,
    //cryptocurrencySymbol, currencySymbol,
    referralsCount, referralsRevenue,
  });
}


const hbsMsgMenuWalletReceiveEN = `
💼 <b>Receive</b>
To receive coins, you need to give the sender the name of your LeoPays account.

Uvas has access to the following accounts:
{{#each accounts}}
{{this}}
{{/each}}
`;
const hbsMsgMenuWalletReceiveRU = `
💼 <b>Получить</b>
Для Получения монет вам нужно передать отправителю имя вашего акаунта в сети LeoPays.

Увас есть доступ к следующим аккаунтам:
{{#each accounts}}
{{this}}
{{/each}}
`;
const msgMenuWalletReceive = (ctx) => {
  const { i18n, session } = ctx;

  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuWalletReceiveEN; break;
    case 'ru': hbsText = hbsMsgMenuWalletReceiveRU; break;
  }
  const template = Handlebars.compile(hbsText);

  const accounts = session.user.accounts;
  return template({ accounts, });
}


module.exports = {
  msgMenuWallet,
  msgMenuWalletReceive,
};

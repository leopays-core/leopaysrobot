const Handlebars = require('handlebars');
const settings = require('../../../settings');
const leopays = require('../../leopays');



const hbsMsgMenuWalletEN = `
💼 <b>Wallet</b>
👤 /a_{{account}}

<b>Balance:</b> {{balance}} {{cryptocurrency_code}}
<b>Equivalent:</b> {{equivalent_balance}} {{currency_code}}
<b>Available:</b> {{available_balance}} {{cryptocurrency_code}}
<b>Staked:</b> {{staked_balance}} {{cryptocurrency_code}}

🤝 <b>Invited:</b> {{count_invited}} users
💰 <b>Revenue:</b> {{sum_revenue}} {{cryptocurrency_code}}
`;
// <b>Примерно:</b> {{this.equivalent}} {{this.currency_symbol}}
// 💰 <b>Заработано:</b> {{referralsRevenue}} {{cryptocurrencySymbol}}
// <b>Доступно:</b> {{this.available}} {{this.cryptocurrency_symbol}}
const hbsMsgMenuWalletRU = `
💼 <b>Кошелек</b>
{{#if accounts}}
{{#each balances}}

👤 /a_{{this.account}}
<b>Баланс:</b> {{this.balance}}
<b>Refunds:</b> {{this.refundsLPC}}{{#if this.refundsLPC}} до {{refundsRequestTime}}{{/if}}
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

    const data = refunds.rows[0];
    const time = new Date(data.request_time + 'Z').getTime();
    const claimTime = time + 3 * 24 * 60 * 60 * 1000;
    new Date(claimTime).toUTCString()

    if (refunds.rows.length > 0) {
      refundsLPC += parseInt(
        parseFloat(refunds.rows[0].net_amount.split(' ')[0]) * 10000
        + parseFloat(refunds.rows[0].cpu_amount.split(' ')[0]) * 10000
      );
      refundsRequestTime = new Date(
        new Date(refunds.rows[0].request_time + 'Z').getTime()
        + 3 * 24 * 60 * 60 * 1000
      ).toUTCString();
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
💼 <b>Wallet</b>
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

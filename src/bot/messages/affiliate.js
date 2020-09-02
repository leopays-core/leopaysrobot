const Handlebars = require('handlebars');
const settings = require('../../../settings');



const hbsmsgMenuAffiliateEN = `
🤝 <b>Affiliate system</b>

Invite new users and get income!

Use a unique referral link to invite users.

https://t.me/{{botUsername}}?start=ref_{{refId}}
`;
const hbsmsgMenuAffiliateRU = `
🤝 <b>Партнерская программа</b>

Приглашайте новых пользователей и получайте доход!

Используйте уникальную реферальную ссылку для приглашения пользователей.

https://t.me/{{botUsername}}?start=ref_{{refId}}
`;
const msgMenuAffiliate = (ctx) => {
  const { i18n, botInfo } = ctx;

  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsmsgMenuAffiliateEN; break;
    case 'ru': hbsText = hbsmsgMenuAffiliateRU; break;
  }

  const botUsername = botInfo.username;
  const refId = ctx.from.id.toString(36);

  const template = Handlebars.compile(hbsText);
  return template({ botUsername, refId });
}


module.exports = {
  msgMenuAffiliate,
};

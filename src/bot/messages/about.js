const Handlebars = require('handlebars');
const { int_to_base58 } = require('base58');
const settings = require('../../../settings');



const hbsMsgMenuAboutEN = `
This telegram bot is a part of <a href="{{company_url}}">{{company_name_com}}</a>.`;
const hbsMsgMenuAboutRU = `
Это телеграм бот <a href="{{company_url}}">{{company_name}}</a>.
`;
const msgMenuAbout = (ctx) => {
  const { i18n } = ctx;
  const { company } = settings;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgMenuAboutEN; break;
    case 'ru': hbsText = hbsMsgMenuAboutRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const company_url = company.url;
  const company_name = company.name;
  return template({
    company_url, company_name,
  });
}


module.exports = {
  msgMenuAbout,
};

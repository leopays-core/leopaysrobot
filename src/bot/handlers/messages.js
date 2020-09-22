const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const {
  withWrongCommandHandler, sendGreetingHandler,
  sendMenuWallet, sendMenuAccounts,
  sendMenuNetwork,
  sendMenuAbout, sendMenuSettings,
  sendMenuToAccount,
} = require('./lib');



const applyHandlersOfMessages = (bot) => {
  bot.hears(/.+/gi, async (ctx, next) => {
    const { i18n, session } = ctx;

    switch (ctx.match[0]) {
      case i18n.t('I totally agree'): {
        const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { 'status.agreed': true, }, { new: true, });
        session.user = doc.toJSON();
        return sendGreetingHandler(ctx);
      }
      default:
        break;
    }

    switch (ctx.match[0]) {
      case i18n.t('Wallet'):
        return sendMenuWallet(ctx);
      case i18n.t('Account'):
        return sendMenuAccounts(ctx);
      case i18n.t('Network'):
        return sendMenuNetwork(ctx);
      case i18n.t('About'):
        return sendMenuAbout(ctx);
      case i18n.t('Settings'):
        return sendMenuSettings(ctx);
      default:
        break;
    }

    switch (ctx.match[0]) {
      default:
        break;
    }

    return next();
  });

  bot.hears(/^\/a_(\w+)/, (ctx) => {
    return sendMenuToAccount(ctx, ctx.match[1]);//ctx.match[1].replace('_', '.')
  });

  // неизвестная команда или текст которые не отработаны обработчиками.
  bot.hears(/.+/gi, withWrongCommandHandler);
};
module.exports = applyHandlersOfMessages;

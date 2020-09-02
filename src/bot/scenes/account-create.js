const WizardScene = require('telegraf/scenes/wizard');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const getExtra = require('../extra');
const { kbMain } = require('../keyboards');
const {
  msgCancelled, msgSendingTheTransaction, msgErrorInTheAccountCreation,
  msgInvalidAccountName, msgAccountCreationStarted, msgThisAccountAlreadyTaken,
} = require('../messages');
const {
  sendMenuAccountCreate, sendMenuTransaction, sendMenuTransactionError,
} = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const settings = require('../../../settings');
const { newAccountDefaultCreator } = settings;



const scene = new WizardScene('account-create',
  (ctx) => {
    sendMenuAccountCreate(ctx);
    return ctx.wizard.next();
  },
  (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'message') {
      let text = '';
      let incorrect = false;

      if (ctx.message.text === i18n.t('Cancel')) {
        text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      const newAccountName = ctx.message.text.toLowerCase().trim();
      if (session.user.accounts.includes(newAccountName))
        incorrect = true;

      // обработка введенного имени
      if (!/[a-z1-5]/.test(newAccountName))
        incorrect = true;
      if (newAccountName.length !== 12)
        incorrect = true;

      if (incorrect) {
        text = msgInvalidAccountName(ctx);
      } else {
        text = msgAccountCreationStarted(ctx) + `\n/a_${newAccountName}`;
      }

      leopays.rpc.get_account(newAccountName).then((data) => {
        const text = msgThisAccountAlreadyTaken(ctx);
        const extra = getExtra({ html: true });
        ctx.reply(text, extra);
      })
        .catch(async (error) => {
          log.debug('its Ok.', SS(error));
          try {
            let creator = newAccountDefaultCreator;
            if (session.user.parent) {
              const parent = await TGUser.findOne({ id: session.user.parent });
              if (parent.account_main)
                creator = parent.account_main
            }

            leopays.accountCreate(creator, newAccountName).then(async (transaction) => {
              delete session.temp;
              sendMenuTransaction(ctx, transaction);

              const doc = await TGUser.findOne({ id: session.user.id });
              if (!doc.accounts.includes(newAccountName)) {
                doc.accounts.push(newAccountName);
                if (doc.account_main === undefined)
                  doc.account_main = newAccountName;
                await doc.save();
                session.user = doc.toJSON();
              }

            }).catch((error) => {
              log.error(error);
              log.error(SS(error));
              return sendMenuTransactionError(ctx, error);
            });
          } catch (error) {
            log.error(error);
            log.error(SS(error));
            const text = msgErrorInTheAccountCreation(ctx);
            const extra = getExtra({ html: true });
            ctx.reply(text, extra);
          }
        });
    }

    text = msgSendingTheTransaction(ctx);
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
  }
);

module.exports = scene;

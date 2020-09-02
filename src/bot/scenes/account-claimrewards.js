const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel } = require('../keyboards');
const {
  msgCancelled, msgSendingTheTransaction, msgSelectAccountForClaimRewards,
} = require('../messages');
const { sendMenuTransaction, sendMenuTransactionError } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-regproducer');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-claimrewards',
  (ctx) => {
    const { session } = ctx;
    const text = msgSelectAccountForClaimRewards(ctx);
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'message') {
      let incorrect = false;

      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      session.temp.owner = ctx.message.text.toLowerCase().trim();
      if (!session.user.accounts.includes(session.temp.owner))
        incorrect = true;

      leopays.accountClaimrewards(session.temp.owner).then(async (transaction) => {
        delete session.temp;
        sendMenuTransaction(ctx, transaction);
      }).catch((error) => {
        log.error(error);
        log.error(SS(error));
        return sendMenuTransactionError(ctx, error);
      });

      const text = msgSendingTheTransaction(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  },
);

module.exports = scene;

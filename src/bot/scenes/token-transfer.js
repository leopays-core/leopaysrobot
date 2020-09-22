const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancelSkip, kbCancel } = require('../keyboards');
const {
  msgCancelled, msgSendingTheTransaction,
  msgSelectFromAccountToSendCoins, msgSelectToAccountToSendCoins,
  msgSpecifyTheNumberOfLPCToSend, msgAvailableToYou, msgFillInTheMemoField,
} = require('../messages');
const { sendMenuTransaction, sendMenuTransactionError } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('token-transfer',
  (ctx) => {
    const { session } = ctx;
    const text = msgSelectFromAccountToSendCoins(ctx);
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
  },
  (ctx) => {
    const { i18n, session } = ctx;
    let incorrect = false;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      session.temp.from = ctx.message.text.toLowerCase().trim();
      if (!session.user.accounts.includes(session.temp.from))
        incorrect = true;

      if (!incorrect) {
        const text = msgSelectToAccountToSendCoins(ctx);
        const keyboard = kbListAndCancel(ctx, session.user.accounts);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.wizard.next();
      }

      const text = msgCancelled(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const { i18n, session } = ctx;
    let incorrect = false;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      session.temp.to = ctx.message.text.toLowerCase().trim();
      if (session.temp.to.length = 0)
        incorrect = true;

      if (session.temp.from === session.temp.to)
        incorrect = true;

      if (!incorrect) {
        let text = msgSpecifyTheNumberOfLPCToSend(ctx);
        session.temp.accInfo = await leopays.rpc.get_account(session.temp.from);

        text += `\n${msgAvailableToYou(ctx)}: ${session.temp.accInfo.core_liquid_balance ? session.temp.accInfo.core_liquid_balance : '0 LPC'}`;
        const keyboard = kbCancel(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.wizard.next();
      }

      const text = msgCancelled(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  },
  (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      session.temp.quantity = ctx.message.text.toLowerCase().trim().replace(' ', '');
      if (/[A-Za-z]/i.test(session.temp.quantity)) {
        session.temp.quantity = parseInt(parseFloat(/[0-9.,]+/.exec(session.temp.quantity)[0]) * 10000) / 10000;
      }
      else
        session.temp.quantity = parseInt(parseFloat(session.temp.quantity) * 10000) / 10000;
      session.temp.quantity = `${session.temp.quantity.toFixed(4)} LPC`;
      const text = msgFillInTheMemoField(ctx);
      const keyboard = kbCancelSkip(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.wizard.next();

    }
  },
  (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }
      if (ctx.message.text === i18n.t('Skip')) {
        session.temp.memo = '';
      }

      leopays.tokenTransfer(session.temp).then(async (transaction) => {
        delete session.temp;
        sendMenuTransaction(ctx, transaction);
      }).catch((error) => {
        log.error(error);
        log.error((SS(error)));
        return sendMenuTransactionError(ctx, error);
      });

      const text = msgSendingTheTransaction(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  }
);

module.exports = scene;

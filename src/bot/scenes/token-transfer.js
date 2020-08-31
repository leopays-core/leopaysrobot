const WizardScene = require('telegraf/scenes/wizard');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancelSkip, kbCancel } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuTransaction } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const settings = require('../../../settings');
const BN = require('bignumber.js');



const scene = new WizardScene('token-transfer',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт с которого вы хотите отправить монеты.`
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
  },
  (ctx) => {
    const { session } = ctx;
    let incorrect = false;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === ctx.i18n.t('Cancel')) {
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
        const text = `Укажите аккаунт на который вы хотите отправить монеты.`
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
    const { session } = ctx;
    let incorrect = false;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === ctx.i18n.t('Cancel')) {
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
        let text = `Укажите числом количество LPC которое вы хотите отправить.`
        session.temp.accInfo = await leopays.rpc.get_account(session.temp.from);

        text += `\nВам доступно: ${session.temp.accInfo.core_liquid_balance ? session.temp.accInfo.core_liquid_balance : '0 LPC'}`;
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
    const { session } = ctx;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === ctx.i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      session.temp.quantity = ctx.message.text.toLowerCase().trim().replace(',', '.');
      if (/[A-Za-z]/i.test(session.temp.quantity)) {
        session.temp.quantity = parseInt(parseFloat(/[0-9.,]+/.exec(session.temp.quantity)[0]) * 10000) / 10000;
      }
      else
        session.temp.quantity = parseInt(parseFloat(session.temp.quantity) * 10000) / 10000;
      session.temp.quantity = `${session.temp.quantity.toFixed(4)} LPC`;
      const text = `Укажите данные в поле 'memo' (Только английские буквы и цифры) или нажмите "Пропустить".`
      const keyboard = kbCancelSkip(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.wizard.next();

    }
  },
  (ctx) => {
    const { session } = ctx;
    if (ctx.updateType === 'message') {
      if (ctx.message.text === ctx.i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }
      if (ctx.message.text === ctx.i18n.t('Skip')) {
        session.temp.memo = '';
      }

      leopays.tokenTransfer(session.temp).then(async (transaction) => {
        delete session.temp;
        sendMenuTransaction(ctx, transaction);
      }).catch((error) => {
        log.error((SS(error)));
      });

      const text = 'Отправка транзакции.';
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  }
);

module.exports = scene;

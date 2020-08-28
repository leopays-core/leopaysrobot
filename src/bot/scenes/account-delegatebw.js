const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancel } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuTransaction } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-delegatebw',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт с которого вы хотите застейковать.`
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
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

      session.temp.from = ctx.message.text.toLowerCase().trim();
      session.temp.receiver = session.temp.from;
      if (!session.user.accounts.includes(session.temp.from))
        incorrect = true;

      if (!incorrect) {
        let text = `Укажите числом количество LPC которое вы хотите застейковать.`;
        const acc = await leopays.rpc.get_account(session.temp.from);
        text += `\nВам доступно: ` + acc.core_liquid_balance ? acc.core_liquid_balance : '0 LPC';
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

      session.temp.quantity = ctx.message.text.toLowerCase().trim();
      if (/[A-Za-z]/i.test(session.temp.quantity)) {
        session.temp.quantity = parseInt(parseFloat(/[0-9.,]+/.exec(session.temp.quantity)[0]) * 10000) / 10000;
      }
      else
        session.temp.quantity = parseInt(parseFloat(session.temp.quantity) * 10000) / 10000;

      session.temp.transfer = false;

      leopays.accountDelegatebw(session.temp).then(async (transaction) => {
        delete session.temp;
        sendMenuTransaction(ctx, transaction);
      }).catch((error) => {
        log.error(error);
      });

    }
    const text = 'Отправка транзакции.';
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
  }
);

module.exports = scene;

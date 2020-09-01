const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancel } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuTransaction, sendMenuTransactionError } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-undelegatebw',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт с которого вы хотите расстейковать.`
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
        let text = `Укажите числом количество LPC которое вы хотите расстейковать.`;
        session.temp.accInfo = await leopays.rpc.get_account(session.temp.from);

        text += `\nВам доступно: ` + `${(session.temp.accInfo.voter_info ? session.temp.accInfo.voter_info.staked : 0) / 10000} LPC`;
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
        session.temp.quantity = parseInt(parseFloat(/[0-9.,]+/.exec(session.temp.quantity)[0]) * 10000);
      }
      else
        session.temp.quantity = parseInt(parseFloat(session.temp.quantity) * 10000);

      session.temp.accInfo = await leopays.rpc.get_account(session.temp.from);


      const staked = parseInt(session.temp.accInfo.voter_info.staked);
      const net = parseInt(parseFloat(session.temp.accInfo.self_delegated_bandwidth.net_weight.split(' ')[0]) * 10000);
      const net_weight = net / staked;
      const cpu = parseInt(parseFloat(session.temp.accInfo.self_delegated_bandwidth.cpu_weight.split(' ')[0]) * 10000);
      const cpu_weight = cpu / staked;

      if (staked === session.temp.quantity) {
        session.temp.unstake_net_quantity = `${(net / 10000).toFixed(4)} LPC`;
        session.temp.unstake_cpu_quantity = `${(cpu / 10000).toFixed(4)} LPC`;
      } else {
        let stake_net_quantity = parseInt(session.temp.quantity * net_weight);
        if ((net - stake_net_quantity) < 0)
          stake_net_quantity = net;
        let stake_cpu_quantity = parseInt(session.temp.quantity * cpu_weight);
        if ((cpu - stake_cpu_quantity) < 0)
          stake_cpu_quantity = cpu;

        let delta = staked - stake_cpu_quantity - stake_net_quantity;
        if (delta < 0) {
          if (stake_net_quantity > stake_cpu_quantity) stake_net_quantity -= delta;
          else stake_cpu_quantity -= delta;
        }

        session.temp.unstake_net_quantity = `${(stake_net_quantity / 10000).toFixed(4)} LPC`;
        session.temp.unstake_cpu_quantity = `${(stake_cpu_quantity / 10000).toFixed(4)} LPC`;
      }

      delete session.temp.quantity;
      session.temp.transfer = false;


      leopays.accountUndelegatebw(session.temp).then(async (transaction) => {
        delete session.temp;
        sendMenuTransaction(ctx, transaction);
      }).catch((error) => {
        log.error(error);
        log.error(SS(error));
        const extra = getExtra({ html: true });
        ctx.reply(sendMenuTransactionError(ctx, error), extra);
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

const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancel } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuTransaction } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-refund',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт с которого вы хотите забрать средства из refund.`
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { session } = ctx;
    let incorrect = false;
    let tooEarly = false;
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
        const refunds = await leopays.rpc.get_table_rows({
          json: true, code: 'lpc', table: 'refunds', scope: session.temp.from,
        });
        session.temp.quantity = 0;
        let netQuantity = 0;
        let cpuQuantity = 0;
        const data = refunds.rows[0];
        const time = new Date(data.request_time + 'Z').getTime();
        const claimTime = time + 3 * 24 * 60 * 60 * 1000;
        if (new Date().getTime() > claimTime) {// 3 дня
          netQuantity = parseInt(parseFloat(data.net_amount.split(' ')[0]) * 10000);
          cpuQuantity = parseInt(parseFloat(data.cpu_amount.split(' ')[0]) * 10000);
          session.temp.quantity += netQuantity + cpuQuantity;
        } else {
          tooEarly = true;
        }

        if (tooEarly) {
          let text = '<b>Слишком рано!</b>'
          text += '\nСредства будут доступны не ранее ' + new Date(claimTime).toUTCString() + '.';
          const extra = getExtra({ html: true });
          ctx.reply(text, extra);
        } else {
          session.temp.unstake_net_quantity = `${(netQuantity / 10000).toFixed(4)} LPC`;
          session.temp.unstake_cpu_quantity = `${(cpuQuantity / 10000).toFixed(4)} LPC`;
          delete session.temp.quantity;
          session.temp.transfer = false;
          return leopays.accountUndelegatebw(session.temp).then(async (transaction) => {
            delete session.temp;
            return sendMenuTransaction(ctx, transaction);
          }).catch((error) => {
            log.error(error);
          });
        }
      }

      const text = msgCancelled(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  }
);

module.exports = scene;

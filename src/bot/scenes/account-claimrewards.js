const WizardScene = require('telegraf/scenes/wizard');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancelSkip, kbCancel } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuAccountRegProd, sendMenuTransaction, } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-regproducer');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const settings = require('../../../settings');
const ecc = require('leopaysjs-ecc');


const scene = new WizardScene('account-claimrewards',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт для которого вы хотите получить вознаграждения.`
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { session } = ctx;
    if (ctx.updateType === 'message') {
      let incorrect = false;
      let text = '';

      if (ctx.message.text === ctx.i18n.t('Cancel')) {
        text = msgCancelled(ctx);
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
        leopays.rpc.history_get_transaction(transaction.transaction_id, transaction.processed.block_num)
        //.then(async (trxData) => { console.log(trx.data) }).catch((error) => { log.error((SS(error))); });
      }).catch((error) => {
        log.error(error);
        const extra = getExtra({ html: true });
        ctx.reply('<b>Нода вернула ошибку</b>', extra);
      });

      text = 'Отправка транзакции.'
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  },
);

module.exports = scene;

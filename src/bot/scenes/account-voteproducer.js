const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbListAndCancel, kbCancel, kbCancelSkip } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuTransaction } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-voteproducer',
  (ctx) => {
    const { session } = ctx;
    const text = `Выберите аккаунт с которого вы хотите проголосовать.`
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

      session.temp.voter = ctx.message.text.toLowerCase().trim();
      if (!session.user.accounts.includes(session.temp.voter))
        incorrect = true;

      if (!incorrect) {
        let text = `Если вы хотите передать ваши голоса в управление то отправьте аккаунт proxy или нажмите Пропустить.`;
        const keyboard = kbCancelSkip(ctx, session.user.accounts);
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

      if (ctx.message.text === ctx.i18n.t('Skip')) {
        session.temp.proxy = undefined;
        const keyboard = kbCancel(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(`Перечислите аккаунты тех производителей блоков за которых вы хотие проголосовать`, extra);
        return ctx.wizard.next();
      } else {
        session.temp.proxy = ctx.message.text.toLowerCase().trim();

        leopays.accountVoteproducer(session.temp).then(async (transaction) => {
          delete session.temp;
          sendMenuTransaction(ctx, transaction);
        }).catch((error) => {
          log.error(error);
        });

        const text = 'Отправка транзакции.';
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }
    }

    const text = msgCancelled(ctx);
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
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
    }
    let producersList = ctx.message.text.toLowerCase().trim();
    producersList = producersList.replace(',', ' ');
    producersList = producersList.replace('    ', ' ');
    producersList = producersList.replace('   ', ' ');
    producersList = producersList.replace('  ', ' ');
    producersList = producersList.split(' ');

    let list = [];
    for (let i in producersList) {
      let producer = producersList[i].trim();
      if (!list.includes(producer))
        list.push(producer);
    }
    list = list.sort();
    session.temp.producers = list;

    leopays.accountVoteproducer(session.temp).then(async (transaction) => {
      delete session.temp;
      sendMenuTransaction(ctx, transaction);
    }).catch((error) => {
      log.error(error);
    });

    const text = 'Отправка транзакции.';
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
  }
);

module.exports = scene;

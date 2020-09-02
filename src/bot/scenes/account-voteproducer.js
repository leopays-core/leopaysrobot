const WizardScene = require('telegraf/scenes/wizard');
const querystring = require('querystring');
const urlapi = require('url');
const getExtra = require('../extra');
const {
  kbMain, kbListAndCancel, kbCancelNext, kbCancelSkip, ikbMenuProducers,
} = require('../keyboards');
const {
  msgCancelled, msgSendingTheTransaction, msgSelectFromAccountToVote,
  msgSelectProxyAccountToVote, msgListBPAccountsToVote, msgListOfBP,
} = require('../messages');
const { sendMenuTransaction, sendMenuTransactionError } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');



const scene = new WizardScene('account-voteproducer',
  (ctx) => {
    const { session } = ctx;
    session.temp.producers = [];
    const text = msgSelectFromAccountToVote(ctx);
    const keyboard = kbListAndCancel(ctx, session.user.accounts);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.wizard.next();
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

      session.temp.voter = ctx.message.text.toLowerCase().trim();
      if (!session.user.accounts.includes(session.temp.voter))
        incorrect = true;

      if (!incorrect) {
        const text = msgSelectProxyAccountToVote(ctx);
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
  async (ctx) => {
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
        session.temp.proxy = undefined;
        const keyboard = kbCancelNext(ctx);
        const text = msgListBPAccountsToVote(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        //leopays.rpc.get_producer_schedule({json:true});
        session.temp.producersData = await leopays.rpc.get_table_rows({
          code: 'lpc', scope: 'lpc', table: 'producers',
          index_position: 2, key_type: 'float64',
          limit: 50,
        });

        const keyboard2 = ikbMenuProducers(session.temp.producersData);
        const text2 = msgListOfBP(ctx);
        const extra2 = getExtra({ html: true, keyboard: keyboard2 });
        ctx.reply(text2, extra2);
        return ctx.wizard.next();
      } else {
        session.temp.proxy = ctx.message.text.toLowerCase().trim();

        leopays.accountVoteproducer(session.temp).then(async (transaction) => {
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
    }

    const text = msgCancelled(ctx);
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
  },
  (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'callback_query') {
      const url = urlapi.parse(ctx.callbackQuery.data);
      const query = url.query === null ? null : querystring.parse(url.query);
      let addText = '';

      if (session.temp.producers.length <= 30) {
        if (session.temp.producers.includes(query.p))
          session.temp.producers = session.temp.producers.filter((element) => element !== query.p);
        else
          session.temp.producers.push(query.p);
      } else
        addText = `\n${msgNoMoreThanMaxBP}`;
      const keyboard2 = ikbMenuProducers(session.temp.producersData, session.temp.producers);
      let text2 = msgListOfBP(ctx);
      for (let i in session.temp.producers)
        text2 += ' ' + session.temp.producers[i] + ', ';
      text2 += addText;
      const extra2 = getExtra({ html: true, keyboard: keyboard2 });
      ctx.editMessageText(text2, extra2);
    }
    if (ctx.updateType === 'message') {
      if (ctx.message.text === i18n.t('Cancel')) {
        const text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }
      if (ctx.message.text === i18n.t('Next')) {
        session.temp.producers = session.temp.producers.sort();
        leopays.accountVoteproducer(session.temp).then(async (transaction) => {
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
      let producersList = ctx.message.text.toLowerCase().trim();
      producersList = producersList.replace(',', ' ');
      producersList = producersList.replace('    ', ' ');
      producersList = producersList.replace('   ', ' ');
      producersList = producersList.replace('  ', ' ');
      producersList = producersList.split(' ');

      for (let i in producersList) {
        let producer = producersList[i].trim();
        if (session.temp.producers.length <= 30)
          if (!session.temp.producers.includes(producer))
            session.temp.producers.push(producer);
      }
    }
  }
);

module.exports = scene;

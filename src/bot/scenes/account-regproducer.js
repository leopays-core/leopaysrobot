const WizardScene = require('telegraf/scenes/wizard');
const getExtra = require('../extra');
const { kbMain, kbCancelSkip } = require('../keyboards');
const {
  msgCancelled, msgSendingTheTransaction, msgUseTheseKeysToStartBlockProduction,
  msgSendTheAddressOfYourNode, msgSendTheYourCountryCode,
} = require('../messages');
const {
  sendMenuAccountRegProd, sendMenuTransaction, sendMenuTransactionError,
} = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-regproducer');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const ecc = require('@leopays-core/leopaysjs-ecc');



const scene = new WizardScene('account-regproducer',
  (ctx) => {
    const { session } = ctx;
    sendMenuAccountRegProd(ctx, session.temp.producer);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { i18n, session } = ctx;
    if (ctx.updateType === 'message') {
      let text = '';

      if (ctx.message.text === i18n.t('Cancel')) {
        text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === i18n.t('Generate Keys')) {
        const privateKey = await ecc.randomKey();
        const publicKey = ecc.privateToPublic(privateKey);
        session.temp.producer_key = publicKey;
        text += msgUseTheseKeysToStartBlockProduction(ctx, { account: session.temp.producer });
        text += `\n----------`;
        text += `\nPrivate Key: ${privateKey}`;
        text += `\nPublic Key:  ${publicKey}`;
        text += `\n----------`;
        const extra = getExtra({ html: true });
        await ctx.reply(text, extra);

        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(msgSendTheAddressOfYourNode(ctx), extra2);
        return ctx.wizard.next();
      }

      if (ctx.message.text && ecc.isValidPublic(ctx.message.text) === true) {
        session.temp.producer_key = ctx.message.text;
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(msgSendTheAddressOfYourNode(ctx), extra2);
        return ctx.wizard.next();
      }

      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(msgCancelled(ctx), extra);
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
        await ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === i18n.t('Skip')) {
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(msgSendTheYourCountryCode(ctx), extra2);
        return ctx.wizard.next();
      }

      if (ctx.message.text.includes('http')) {
        session.temp.url = ctx.message.text;
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(msgSendTheYourCountryCode(ctx), extra2);
        return ctx.wizard.next();
      }

      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      await ctx.reply(msgCancelled(ctx), extra);
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
        await ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === i18n.t('Skip')) {
        const text = msgSendingTheTransaction(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        await ctx.reply(text, extra);
        return leopays.accountRegProducer(session.temp).then(async (transaction) => {
          sendMenuTransaction(ctx, transaction);
          editMenuToAccount(ctx, account);
          return ctx.wizard.next();
        }).catch((error) => {
          log.error(error);
          log.error(SS(error));
          return sendMenuTransactionError(ctx, error);
        });
      }

      if (Number.isInteger(parseInt(ctx.message.text))) {
        session.temp.location = parseInt(ctx.message.text);
        const text = msgSendingTheTransaction(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return leopays.accountRegProducer(session.temp).then(async (transaction) => {
          delete session.temp;
          sendMenuTransaction(ctx, transaction);
          editMenuToAccount(ctx, account);
          ctx.scene.leave();
        }).catch((error) => {
          log.error(error);
          log.error((SS(error)));
          sendMenuTransactionError(ctx, error);
        });
      }

      const text = msgCancelled(ctx);
      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(text, extra);
      return ctx.scene.leave();
    }
  },
);

module.exports = scene;

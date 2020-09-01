const WizardScene = require('telegraf/scenes/wizard');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const getExtra = require('../extra');
const { kbMain, kbCancelSkip } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuAccountRegProd, sendMenuTransaction, sendMenuTransactionError } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-regproducer');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const settings = require('../../../settings');
const ecc = require('leopaysjs-ecc');



const textForUrl = `
<b>Пришлите адрес вашего сайта или ноды.</b>
Пример: https://leopays.com`;
const textForLocation = `
<b>Пришлите цифровой код вашей страны.</b>
Согласно ISO 3166, https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
Пример для России: 643`;

const scene = new WizardScene('account-regproducer',
  (ctx) => {
    const { session } = ctx;
    sendMenuAccountRegProd(ctx, session.temp.producer);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { session } = ctx;
    if (ctx.updateType === 'message') {
      let text = '';

      if (ctx.message.text === ctx.i18n.t('Cancel')) {
        text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === ctx.i18n.t('Generate Keys')) {
        const privateKey = await ecc.randomKey();
        const publicKey = ecc.privateToPublic(privateKey);
        session.temp.producer_key = publicKey;
        text += `\n<b>Используйте этот приватный ключ c аккаунтом '${session.temp.producer}' для запуска производства блоков в lepays-node.</b>`;
        text += `\n----------`;
        text += `\nPrivate Key: ${privateKey}`;
        text += `\nPublic Key:  ${publicKey}`;
        text += `\n----------`;
        const extra = getExtra({ html: true });
        await ctx.reply(text, extra);

        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(textForUrl, extra2);
        return ctx.wizard.next();
      }

      if (ctx.message.text && ecc.isValidPublic(ctx.message.text) === true) {
        session.temp.producer_key = ctx.message.text;
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(textForUrl, extra2);
        return ctx.wizard.next();
      }

      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      ctx.reply(msgCancelled(ctx), extra);
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
        await ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === ctx.i18n.t('Skip')) {
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(textForLocation, extra2);
        return ctx.wizard.next();
      }

      if (ctx.message.text.includes('http')) {
        session.temp.url = ctx.message.text;
        const keyboard = kbCancelSkip(ctx);
        const extra2 = getExtra({ html: true, keyboard });
        await ctx.reply(textForLocation, extra2);
        return ctx.wizard.next();
      }

      const keyboard = kbMain(ctx);
      const extra = getExtra({ html: true, keyboard });
      await ctx.reply(msgCancelled(ctx), extra);
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
        await ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      if (ctx.message.text === ctx.i18n.t('Skip')) {
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        await ctx.reply(`<b>Выполнение настройки.</b>`, extra);
        return leopays.accountRegProducer(session.temp).then(async (transaction) => {
          sendMenuTransaction(ctx, transaction);
          editMenuToAccount(ctx, account);
          return ctx.wizard.next();
        }).catch((error) => {
          log.error(error);
          log.error(SS(error));
          const extra = getExtra({ html: true });
          ctx.reply(sendMenuTransactionError(ctx, error), extra);
        });
      }

      if (Number.isInteger(parseInt(ctx.message.text))) {
        session.temp.location = parseInt(ctx.message.text);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(`<b>Выполнение настройки.</b>`, extra);
        return leopays.accountRegProducer(session.temp).then(async (transaction) => {
          delete session.temp;
          sendMenuTransaction(ctx, transaction);
          editMenuToAccount(ctx, account);
          return ctx.scene.leave();
        }).catch((error) => {
          log.error((SS(error)));
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
  },
);

module.exports = scene;

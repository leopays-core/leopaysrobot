const WizardScene = require('telegraf/scenes/wizard');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const getExtra = require('../extra');
const { kbMain } = require('../keyboards');
const { msgCancelled } = require('../messages');
const { sendMenuAccountCreate, sendMenuTransaction } = require('../handlers/lib');
const logger = require('../../logger');
const log = logger.getLogger('scene:account-create');
const SS = require('../../lib/smart-stringify');
const leopays = require('../../leopays');
const settings = require('../../../settings');
const { explorer, newAccountDefaultCreator } = settings;


const scene = new WizardScene('account-create',
  (ctx) => {
    sendMenuAccountCreate(ctx);
    return ctx.wizard.next();
  },
  (ctx) => {
    const { session } = ctx;
    if (ctx.updateType === 'message') {
      let text = '';
      let incorrect = false;

      if (ctx.message.text === ctx.i18n.t('Cancel')) {
        text = msgCancelled(ctx);
        const keyboard = kbMain(ctx);
        const extra = getExtra({ html: true, keyboard });
        ctx.reply(text, extra);
        return ctx.scene.leave();
      }

      const newAccountName = ctx.message.text.toLowerCase().trim();
      if (session.user.accounts.includes(newAccountName))
        incorrect = true;

      // обработка введенного имени
      if (!/[a-z1-5]/.test(newAccountName))
        incorrect = true;
      if (newAccountName.length !== 12)
        incorrect = true;

      if (incorrect) {
        const textEN = `<b>Invalid account name</b>`;
        const textRU = `<b>Неверное имя аккаунта</b>`;
        text = (ctx.i18n.locale() === 'en') ? textEN : textRU;
      } else {
        text = `<b>Запущено создание аккаунта</b>: /a_${newAccountName}`;
      }

      leopays.rpc.get_account(newAccountName).then((data) => {
        const text = `<b>Этот аккаунт (${newAccountName}) уже занят.</b> Попробуйте другое имя.`;
        const extra = getExtra({ html: true });
        ctx.reply(text, extra);
      })
        .catch(async (error) => {
          log.debug('its Ok.', SS(error));
          try {
            let creator = newAccountDefaultCreator;
            if (session.user.parent) {
              const parent = await TGUser.findOne({ id: session.user.parent });
              if (parent.account_main)
                creator = parent.account_main
            }

            leopays.accountCreate(creator, newAccountName).then(async (transaction) => {
              delete session.temp;
              sendMenuTransaction(ctx, transaction);

              const doc = await TGUser.findOne({ id: session.user.id });
              if (!doc.accounts.includes(newAccountName)) {
                doc.accounts.push(newAccountName);
                if (doc.account_main === undefined)
                  doc.account_main = newAccountName;
                await doc.save();
                session.user = doc.toJSON();
              }

            }).catch((error) => {
              log.error(error);
              const extra = getExtra({ html: true });
              ctx.reply('<b>Нода вернула ошибку</b>', extra);
            });
          } catch (error) {
            log.error(error);
            const text = `<b>Ошибка в процессе создания аккаунта.</b>`;
            const extra = getExtra({ html: true });
            ctx.reply(text, extra);
          }
        });
    }

    text = 'Отправка транзакции'
    const keyboard = kbMain(ctx);
    const extra = getExtra({ html: true, keyboard });
    ctx.reply(text, extra);
    return ctx.scene.leave();
  }
);

module.exports = scene;

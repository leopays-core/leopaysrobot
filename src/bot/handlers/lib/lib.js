const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const about = require('./about');
const account = require('./account');
const affiliate = require('./affiliate');
const settings = require('./settings');
const wallet = require('./wallet');
const SS = require('../../../lib/smart-stringify');
const getExtra = require('../../extra');
const {
  msgMenuTransaction,
  msgNewReferal,
  msgAgreeTermsOfService,
  msgShortInfo, msgGreeting,
  msgWrongCommand,
  msgMenuSelecAccount,
} = require('../../messages');
const {
  ikbMenuTransaction,
  kbIAgree, kbMain,
  ikbMenuShortInfo,
  ikbMenuSelecAccount,
  ikbMenuNetwork,
  ikbMenuNetworkProds,
} = require('../../keyboards');



async function sendMenuTransaction(ctx, transaction) {
  const text = msgMenuTransaction(ctx, transaction);
  const keyboard = ikbMenuTransaction(ctx, transaction);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
async function sendMenuTransactionError(ctx, errorObj) {
  const { i18n } = ctx;
  let txt = `<b>${i18n.t('LeoPays node returned an error')}</b>\n`;
  //txt += `<code>${SS(errorObj)}</code>`;
  let errObj = {};
  errObj.code = (errorObj.json && errorObj.json.code) ? errorObj.json.code : null;
  errObj.message = (errorObj.json && errorObj.json.message) ? errorObj.json.message : null
  errObj.error = {
    code: (errorObj.json && errorObj.json.error && errorObj.json.error.code) ? errorObj.json.error.code : null,
    message: (errorObj.json && errorObj.json.error && errorObj.json.error.details) ? errorObj.json.error.details[0].message : null,
  };
  txt += `<code>${SS(errObj)}</code>`;
  const extra = getExtra({ html: true });
  return ctx.reply(txt, extra);
}

async function sendMenuNetwork(ctx) {
  const { i18n } = ctx;
  const text = `<b>${i18n.t('Network')}</b>`;
  const keyboard = ikbMenuNetwork(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}
async function editToMenuNetwork(ctx) {
  const { i18n } = ctx;
  const text = `<b>${i18n.t('Network')}</b>`;
  const keyboard = ikbMenuNetwork(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}
async function editToMenuNetworkProds(ctx, producersdata = { rows: [], more: false }, selectes = []) {
  const { i18n } = ctx;
  const text = `<b>${i18n.t('Block Producers')}</b>`;
  const keyboard = ikbMenuNetworkProds(ctx, producersdata, selectes);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}


async function sendAgreeIsExpectedHandler(ctx) {
  const text = msgAgreeTermsOfService(ctx);
  const keyboard = kbIAgree(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function addRef(ctx, parent_id) {
  const { from, session, telegram } = ctx;
  const parentId = parseInt(parent_id);
  if (from.id === parent_id)
    return;
  if (session.user.parent === undefined) {// Если реф родитель не задан
    const parent = await TGUser.findOne({ id: parent_id });
    if (parent !== null) { // родитель найден бд
      const doc = await TGUser.findOneAndUpdate({ id: from.id }, { parent: parent_id, }, { new: true, });
      session.user = doc.toJSON();

      await TGUser.findOneAndUpdate({ id: parent_id }, { $inc: { 'referrals.count': 1, }, });

      // уведомление родителя
      const extra = getExtra({ html: true });
      await telegram.sendMessage(
        parent_id,
        msgNewReferal(ctx, { public_name: session.user.public_name }),
        extra
      );
    }
  }
}


async function cmdStartHandler(ctx, next) {
  const { startPayload, session } = ctx;
  const { user } = session;

  const req = startPayload.split('_');

  if (startPayload !== '') {
    switch (req[0]) {
      case 'u': { // отправляем данные о пользователе и пропускаем дальше чтобы добавить как рефералла
        let user_id = 0;
        switch (true) {
          case /^[a-z0-9]+/.test(req[1]): // base36 [a-z0-9] - из его id
            user_id = parseInt(req[1], 36);
            break;
          case /^[A-Za-z0-9]+/.test(req[1]): // [A-Za-z0-9_] -  из англиского текста
            const doc = await TGUser.findOne({ public_name: req[1] });
            if (doc !== null)
              user_id = doc.id;
            break;
          default:
            break;
        }
        // показать инфу о пользователе по его user_id
        break;
      }
      case 'ref': {
        switch (true) {
          case /^[a-z0-9]+/.test(req[1]): // base36 [a-z0-9] - реф ссылка на пользователя из его id
            const parent_id = parseInt(req[1], 36);
            await addRef(ctx, parent_id);
            break;
          case /^[A-Za-z0-9]+/.test(req[1]): // [A-Za-z0-9_] - реф ссылка на пользователя из англиского текста
            const parent = await TGUser.findOne({ public_name: req[1] });
            if (parent !== null) // родитель найден бд
              await addRef(ctx, parent.id);
            break;
          default:
            break;
        }
        break;
      }
      default:
        break;
    }
  }

  if (user.status.agreed) {
    return sendShortInfoHandler(ctx)
      .then((message) => sendGreetingHandler(ctx));
  }

  return sendAgreeIsExpectedHandler(ctx);
}


async function sendShortInfoHandler(ctx) {
  const text = msgShortInfo(ctx);
  const keyboard = ikbMenuShortInfo(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function sendGreetingHandler(ctx) {
  const text = msgGreeting(ctx);
  const keyboard = kbMain(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


function withWrongCommandHandler(ctx) {
  ctx.log.warn(`{"wrong_command:"${JSON.stringify(ctx.update)}}`);
  const text = msgWrongCommand(ctx);
  const keyboard = kbMain(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
};



function sendMenuSelecAccount(ctx, pathname, accounts) {
  const text = msgMenuSelecAccount(ctx);
  const keyboard = ikbMenuSelecAccount(ctx, pathname, accounts);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
};

async function editMenuToSelecAccount(ctx, pathname, accounts) {
  const text = msgMenuSelecAccount(ctx);
  const keyboard = ikbMenuSelecAccount(ctx, pathname, accounts);
  const extra = getExtra({ html: true, keyboard });
  return ctx.editMessageText(text, extra);
}


module.exports = {
  sendMenuTransaction,
  sendMenuTransactionError,
  sendMenuNetwork,
  editToMenuNetwork,
  editToMenuNetworkProds,
  sendMenuSelecAccount,
  editMenuToSelecAccount,
  sendAgreeIsExpectedHandler,
  addRef,
  cmdStartHandler,
  sendShortInfoHandler,
  sendShortInfoHandler,
  sendGreetingHandler,
  withWrongCommandHandler,
  ...about,
  ...account,
  ...affiliate,
  ...settings,
  ...wallet,
};

const sessionOnMemory = require('telegraf/session');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const settings = require('../../../settings');
const i18n = require('../i18n');
const stage = require('../stage');
const getExtra = require('../extra');
const { kbStart } = require('../keyboards');
const { sendAgreeIsExpectedHandler, addRef } = require('../handlers/lib');
const getRendomPublicName = require('../../get-rendom-public-name');



const applyMiddlewares = (bot) => {
  bot.catch((error, ctx) => {
    ctx.log.error(`Bot Error catched! Ooops, ecountered an error for '${ctx.updateType}'`, error);
  });
  bot.use((ctx, next) => {
    ctx.log.trace(`{"update":${JSON.stringify(ctx.update)}}`);
    return next();
  });

  bot.use(sessionOnMemory())
  bot.use(i18n.middleware());
  bot.use(stage.middleware());

  bot.use(async (ctx, next) => {
    const { log, i18n, session } = ctx;
    if (session.temp === undefined) session.temp = {};

    await updateUser(ctx);

    if (session.user.status.blocked) {
      log.warn(`{"user_blocked":${JSON.stringify(session.user)}}`);
      switch (ctx.updateType) {
        case 'message': {
          const keyboard = kbStart(ctx);
          const extra = getExtra({ html: true, keyboard });
          return ctx.reply('Something wrong...', extra);
        }
        case 'callback_query': {
          ctx.answerCbQuery('Something wrong...');
          const keyboard = kbStart(ctx);
          const extra = getExtra({ html: true, keyboard });
          return ctx.reply('Something wrong...', extra);
        }
        default:// Игнорирование других типов обновлений
          return;
      }
    }

    if (!session.user.status.agreed) { // Если еще не согласился с условиями
      switch (ctx.updateType) {
        case 'message': {
          if (ctx.message.text === i18n.t('I totally agree')) { // согласие получено
            //const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { agreed: true, }, { new: true, });
            //session.user = doc.toJSON();
            return next().then(async () => { // перенаправление (отправка нужного меню) после согласия
              if (session.user.redirect) {
                if (session.user.redirect.includes('_')) {
                  // session.user.redirect = 'ref_1';
                  const req = session.user.redirect.split('_'); // ['ref', '1']
                  switch (req[0]) {
                    case 'u': {
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
                    default:
                      break;
                  }
                }
                const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { redirect: null, }, { new: true, });
                session.user = doc.toJSON();
                return;
              }
            });
          } else { // любое другое текстовое сообщение
            // ctx.message.text = '/start ref_1';
            if (/^\/start/.test(ctx.message.text)) {
              const startPayload = ctx.message.text.split(' ')[1]; // ref_1
              if (startPayload) {
                const req = startPayload.split('_'); // ['ref', '1']
                switch (req[0]) {
                  case 'u': // user
                    const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { redirect: startPayload, }, { new: true, });
                    session.user = doc.toJSON();
                  case 'ref': {
                    switch (true) {
                      case /^[a-z0-9]+/.test(req[1]): // base36 [a-z0-9] - реф ссылка на пользователя из его id
                        const parent_id = parseInt(req[1], 36);
                        await addRef(ctx, parent_id);
                        break;
                      case /^[A-Za-z0-9]+/.test(req[1]): // [A-Za-z0-9_] - реф ссылка на пользователя из англиского текста
                        const doc = await TGUser.findOne({ public_name: req[1] });
                        if (parent !== null) // родитель найден бд
                          await addRef(ctx, parent.id);
                        break;
                      default:
                        break;
                    }
                    break;
                  }
                  default: { // если не реферальная то сохраняем в редирект
                    const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id }, { redirect: startPayload, }, { new: true, });
                    session.user = doc.toJSON();
                    break;
                  }
                }
              }
            }
          }
        }
        default: // по дефолту и если тип не message
          return sendAgreeIsExpectedHandler(ctx);
      }
    } // далее если соглашение принято

    return next();
  });
}
module.exports = applyMiddlewares;


async function updateUser(ctx) {
  const { session } = ctx;

  ctx.getChat()
    .then(async (data) => {
      if (!session.user.photo)
        await TGUser.findOneAndUpdate({ id: ctx.from.id }, Object.assign({}, data));
      else if (session.user.photo.small_file_unique_id !== data.photo.small_file_unique_id)
        await TGUser.findOneAndUpdate({ id: ctx.from.id }, Object.assign({}, data));
    });
  /*ctx.telegram.getUserProfilePhotos(ctx.from.id)
    .then(async (data) => {
      const user = await TGUser.findOne({ id: ctx.from.id });
      const newPhotos = [];
      const existsPhotos = [];
      for (let i in data.photos) {
        if (!user.photos.includes(data.photos[i].file_unique_id)) {
          newPhotos.push(data.photos[i]);
        } else {
          if (!existsPhotos.includes(data.photos[i].file_unique_id))
            existsPhotos.push(data.photos[i].file_unique_id);
        }
        // !?! await TGUser.findOneAndUpdate({ id: ctx.from.id }, Object.assign({}, { photos: data.photos }));
      }
      // !?! Вычисление фото к удалению и добавлению
    });*/

  if (session.user === undefined) {
    // Получение записи пользователя из БД или создание нового пользователя
    let doc = await TGUser.findOneAndUpdate({ id: ctx.from.id },
      Object.assign({}, ctx.from, { last_active_at: new Date().getTime() }),
      { new: true, upsert: true, }
    );
    session.user = doc.toJSON();

    // Установка значений по умолчанию для нового пользователя.
    await setDefaultsForNewUser(ctx);

    // Сохранение новых данных в БД и обновление сессии результатом сохранения
    doc = await TGUser.findOneAndUpdate({ id: ctx.from.id },
      Object.assign({}, session.user),
      { new: true, }
    );
    session.user = doc.toJSON();
  } else {
    // Данных в БД и обновление сессии
    const doc = await TGUser.findOneAndUpdate({ id: ctx.from.id },
      Object.assign({}, ctx.from, { last_active_at: new Date().getTime() }),
      { new: true, }
    );
    session.user = doc.toJSON();
  }
}


async function setDefaultsForNewUser(ctx) {
  const { public_name } = settings;
  const { user } = ctx.session;

  if (!user.public_name && public_name.enabled)
    user.public_name = await getRendomPublicName(user, settings);
}

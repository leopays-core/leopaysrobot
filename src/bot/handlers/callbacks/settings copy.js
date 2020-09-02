/**
 * Модуль устанавливает обработчики для обратных вызовов.
 * @module
 */
const getExtra = require('../../extra');
const { kbMain, } = require('../../keyboards');
const {
  editMenuToSettings,
  editMenuToSettingsLanguage,
  editIkbToSettingsLanguage,
  editMenuToSettingsCurrency,
  editIkbToSettingsCurrency,

  editMenuToSettingsRate,
  sendMenuSettingsFavoriteAddresses,
  sendMenuSettingsTimeZone,
  editIkbToSettingsTimeZone,
  editMenuToSettingsTimeZone,
  sendMenuSettingsNotification,
  sendMenuSettingsNotificationChangeMode,
} = require('../lib');
const urlapi = require('url');
const querystring = require('querystring');
const { c } = require('../../default-data');


const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery, i18n, session, db, } = ctx;
    ctx.log.debug(`callbackQuery.data: '${callbackQuery.data}', length: ${callbackQuery.data.length}`);
    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);

    switch (url.pathname) {
      case `${c.settingsL3}`:
        return editMenuToSettings(ctx);
      case `${c.settingsL3}/language`: {
        let params = { limit: 20, offset: 0 };
        if (query !== null) {
          if (query.id !== undefined) {
            session.user = await db.setUserLanguageCode(session.user._id, query.id);
            if (query.l !== undefined && query.o !== undefined) {
              params.limit = parseInt(query.l);
              params.offset = parseInt(query.o);
            }

            ctx.answerCbQuery(query.id);
            i18n.locale(session.user.language);
            const text = i18n.t('Done!');
            const keyboard = kbMain(ctx);
            const extra = getExtra({ html: true, keyboard });
            ctx.reply(text, extra);

            return editMenuToSettingsLanguage(ctx, params);
          }
          if (query.l !== undefined && query.o !== undefined) {
            params.limit = parseInt(query.l);
            params.offset = parseInt(query.o);
            return editIkbToSettingsLanguage(ctx, params);
          }
        }
        return editMenuToSettingsLanguage(ctx, params);
      }
      case `${c.settingsL3}/rate`: {
        if (query !== null) {
          if (query.id !== undefined) {
            session.user.rate.set(query.market, query.id);
            session.user = await db.getAndUpdateUserByTGUser(session.user);

            ctx.answerCbQuery('');
            const text = i18n.t('Done!');
            const keyboard = kbMain(ctx);
            const extra = getExtra({ html: true, keyboard });
            ctx.reply(text, extra);
          }
        }
        return editMenuToSettingsRate(ctx);
      }
      case `${c.settingsL3}/currency`: {
        let params = { limit: 20, offset: 0 };
        if (query !== null) {
          if (query.id !== undefined) {
            session.user = await db.setUserCurrencyCode(session.user._id, query.id);
            if (query.l !== undefined && query.o !== undefined) {
              params.limit = parseInt(query.l);
              params.offset = parseInt(query.o);
            }

            ctx.answerCbQuery(query.id);
            const text = i18n.t('Done!');
            const keyboard = kbMain(ctx);
            const extra = getExtra({ html: true, keyboard });
            ctx.reply(text, extra);

            return editMenuToSettingsCurrency(ctx, params);
          }
          if (query.l !== undefined && query.o !== undefined) {
            params.limit = parseInt(query.l);
            params.offset = parseInt(query.o);
            return editIkbToSettingsCurrency(ctx, params);
          }
        }
        return editMenuToSettingsCurrency(ctx, params);
      }
      case `${c.settingsL3}/public_name`:
        return ctx.scene.enter('change-public_name');
      case `${c.settingsL3}/favorite_addresses`:
        return sendMenuSettingsFavoriteAddresses(ctx);
      case `${c.settingsL3}/favorite_addresses/add`:
        return ctx.scene.enter('add-favorite_address');
      case `${c.settingsL3}/save_payment_details`: {
        session.user = await db.setUserSavePaymentDetails(session.user._id, !session.user.save_payment_details);
        ctx.answerCbQuery('');
        return editMenuToSettings(ctx);
      }
      case `${c.settingsL3}/tz`: {
        let params = { limit: 20, offset: 0 };
        if (query !== null) {
          if (query.id !== undefined) {
            session.user = await db.setUserTimeZone(session.user._id, parseInt(query.id));
            if (query.l !== undefined && query.o !== undefined) {
              params.limit = parseInt(query.l);
              params.offset = parseInt(query.o);
            }
            ctx.answerCbQuery('');
            const text = i18n.t('Done!');
            const extra = getExtra({ html: true });
            ctx.reply(text, extra);
            return editMenuToSettingsTimeZone(ctx, params);
          }
          if (query.l !== undefined && query.o !== undefined) {
            params.limit = parseInt(query.l);
            params.offset = parseInt(query.o);
            return editIkbToSettingsTimeZone(ctx, params);
          }
        }
        return sendMenuSettingsTimeZone(ctx, params);
      }
      case `${c.settingsL3}/notification`:
        let params = {};
        if (query !== null) {
          if (query.id !== undefined) {
            switch (query.id) {
              case 'new_referral':
                params.type = 'new_referral';
                break;
              case 'referal_payment':
                params.type = 'referal_payment';
                break;
              case 'free_trade':
                params.type = 'free_trade';
                break;
              case 'service_message':
                params.type = 'service_message';
                break;
            }
            if (query.mode) {
              switch (query.mode) {
                case 'enabled':
                  if (session.user.notification[params.type].enabled) {
                    session.user.notification[params.type].enabled = false;
                    session.user.notification[params.type].mode.silent = false;
                    session.user.notification[params.type].mode.night = false;
                  } else
                    session.user.notification[params.type].enabled = true;
                  break;
                case 'silent':
                  if (session.user.notification[params.type].enabled)
                    session.user.notification[params.type].mode.silent = !session.user.notification[params.type].mode.silent;
                  break;
                case 'night':
                  if (session.user.notification[params.type].enabled)
                    session.user.notification[params.type].mode.night = !session.user.notification[params.type].mode.night;
                  break;
              }
              await db.getAndUpdateUserByTGUser(session.user);
            }
            return sendMenuSettingsNotificationChangeMode(ctx, params);
          }
        }
        return sendMenuSettingsNotification(ctx);
      default:
        break;
    }

    return next();
  });
};

module.exports = applyHandlersOfCallbacks;

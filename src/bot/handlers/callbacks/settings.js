const { base58_to_int } = require('base58');
const querystring = require('querystring');
const urlapi = require('url');
const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const db = require('../../db');
const settings = require('../../../../settings');
const SS = require('../../../lib/smart-stringify');
const log = require('../../../logger').getLogger('callbacks:settings');
const getExtra = require('../../extra');
const { kbMain, } = require('../../keyboards');
const {
  editMenuToSettings,
  editMenuToSettingsLanguage,
  editIkbToSettingsLanguage,
} = require('../lib');
const { c } = settings;



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', async (ctx, next) => {
    const { callbackQuery, i18n, session, } = ctx;
    ctx.log.debug(`callbackQuery.data: '${callbackQuery.data}', length: ${callbackQuery.data.length}`);
    const url = urlapi.parse(callbackQuery.data);
    const query = url.query === null ? null : querystring.parse(url.query);

    switch (url.pathname) {
      case `${c.settingsL3}`:
        return editMenuToSettings(ctx);
      case `${c.settingsL3}/lng`: {
        let params = { limit: 20, offset: 0 };
        if (query !== null) {
          if (query.id !== undefined) {
            session.user = await db.setTGUserLanguageCode(session.user._id, query.id);
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
      default:
        break;
    }

    return next();
  });
};

module.exports = applyHandlersOfCallbacks;

const log = require('../../logger').getLogger('bot');



const applyContext = (bot) => {
  bot.context.log = log;
}

module.exports = applyContext;

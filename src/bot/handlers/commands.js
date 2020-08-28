const { cmdStartHandler } = require('./lib');



const applyHandlersOfCommands = (bot) => {
  bot.start(cmdStartHandler);
  //bot.help(...);
  //bot.settings(sendMenuSettings);
};
module.exports = applyHandlersOfCommands;

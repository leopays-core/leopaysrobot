const { createActionUpdateauth } = require('./actions');
const log = require('../logger').getLogger('LeoPays:accountUpdateAuth()');
const SS = require('../lib/smart-stringify');



const accountCreate = (params = {}) => {
  const { transactionSend } = params;

  function accountUpdateAuth(params = {}) {
    const { auth, authorization, data, } = params;
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const updateauth = createActionUpdateauth({ auth, authorization, data });
      actions.push(updateauth);

      try {
        const transaction = await transactionSend(actions);
        log.trace('transaction:', SS(transaction));
        return resolve(transaction);
      } catch (error) {
        log.error(SS(error));
        return reject(error);
      }
    });
  }
  return {
    accountUpdateAuth,
  };
}

module.exports = accountCreate;

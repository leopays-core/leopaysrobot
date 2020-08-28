const log = require('../logger').getLogger('LeoPays:accountDelegatebw()');
const { createAccountUndelegatebw } = require('./actions');
const SS = require('../lib/smart-stringify');



const initAccountUndelegatebw = (params) => {
  const { transactionSend, } = params;
  const accountUndelegatebw = (owner) => {
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const undelegatebw = createAccountUndelegatebw(owner);
      actions.push(undelegatebw);

      try {
        transactionSend(actions).then((transaction) => {
          log.trace('transaction:', SS(transaction));
          return resolve(transaction);
        })
          .catch((error) => {
            log.error(SS(error));
            return reject(error);
          });
      } catch (error) {
        log.error(SS(error));
        return reject(error);
      }
    });
  }

  return { accountUndelegatebw };
}


module.exports = (params) => {
  return {
    ...initAccountUndelegatebw(params),
  };
}

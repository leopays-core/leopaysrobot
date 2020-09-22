const log = require('../logger').getLogger('LeoPays:accountDelegatebw()');
const { createAccountDelegatebw } = require('./actions');
const SS = require('../lib/smart-stringify');



const initAccountDelegatebw = (params) => {
  const { transactionSend, } = params;
  const accountDelegatebw = (owner) => {
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const delegatebw = createAccountDelegatebw(owner);
      actions.push(delegatebw);

      try {
        const transaction = await transactionSend(actions);
        log.trace('transaction:', SS(transaction));
        return resolve(transaction);
      } catch (error) {
        log.error(error);
        log.error(SS(error));
        return reject(error);
      }
    });
  }

  return { accountDelegatebw };
}


module.exports = (params) => {
  return {
    ...initAccountDelegatebw(params),
  };
}

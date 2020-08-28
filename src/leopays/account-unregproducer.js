const { createActionUnRegProducer } = require('./actions');
const log = require('../logger').getLogger('LeoPays:accountUnRegProducer()');
const SS = require('../lib/smart-stringify');



const initAccountUnRegProducer = (params = {}) => {
  const { transactionSend } = params;

  function accountUnRegProducer(producer) {
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const unregprod = createActionUnRegProducer(producer);
      actions.push(unregprod);

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
    accountUnRegProducer,
  };
}

module.exports = (params) => {
  return {
    ...initAccountUnRegProducer(params),
  };
}

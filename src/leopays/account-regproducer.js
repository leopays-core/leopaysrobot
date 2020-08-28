const { createActionRegProducer } = require('./actions');
const log = require('../logger').getLogger('LeoPays:accountRegProducer()');
const SS = require('../lib/smart-stringify');



const initAccountRegProducer = (params = {}) => {
  const { transactionSend } = params;

  function accountRegProducer(params = {}) {
    const { producer, producer_key, url, location } = params;
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const regproducer = createActionRegProducer({ producer, producer_key, url, location });
      actions.push(regproducer);

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
    accountRegProducer,
  };
}

module.exports = (params) => {
  return {
    ...initAccountRegProducer(params),
  };
}

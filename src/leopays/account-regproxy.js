const log = require('../logger').getLogger('LeoPays:refProxy()');
const { createRegProxy } = require('./actions');
const SS = require('../lib/smart-stringify');



const initRegProxy = (params) => {
  const { transactionSend, } = params;
  const regProxy = (proxy, isproxy) => {
    if (!proxy) throw new Error('New account name not specified!');
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const regproxy = createRegProxy(proxy, isproxy);
      actions.push(regproxy);

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

  return { regProxy };
}


module.exports = (params) => {
  return {
    ...initRegProxy(params),
  };
}

const log = require('../logger').getLogger('LeoPays:transactionSend()');
const SS = require('../lib/smart-stringify');



const initTransactionSend = (params) => {
  const { rpc, api, } = params;
  const transactionSend = (actions = []) => {
    log.trace('actions:', SS(actions));
    return new Promise(async (resolve, reject) => {
      try {
        //const info = await rpc.get_info();
        api.transact(
          { actions },
          { blocksBehind: 3, expireSeconds: 60, }
        )
          .then((transaction) => {
            log.trace('transaction:', SS(transaction));
            return resolve(transaction);
          })
          .catch((error) => {
            log.error(error);
            return reject(error);
          });
      } catch (error) {
        log.error(error);
        return reject(error);
      }
    });
  }

  return { transactionSend };
}


module.exports = (params) => {
  return {
    ...initTransactionSend(params),
  };
}

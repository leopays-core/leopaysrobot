const settings = require('../../settings');
const log = require('../logger').getLogger('LeoPays:tokenTransfer()');
const { createTokenTransfer } = require('./actions');
const SS = require('../lib/smart-stringify');



const initTokenTransfer = (params) => {
  const { transactionSend, } = params;
  const tokenTransfer = (params = {}) => {
    const { from, to, quantity, memo } = params;
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const transfer = createTokenTransfer({ from, to, quantity, memo });
      actions.push(transfer);

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

  return { tokenTransfer };
}


module.exports = (params) => {
  return {
    ...initTokenTransfer(params),
  };
}

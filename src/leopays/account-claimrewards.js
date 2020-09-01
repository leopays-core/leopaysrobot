const log = require('../logger').getLogger('LeoPays:accountClaimrewards()');
const { createAccountClaimrewards } = require('./actions');
const SS = require('../lib/smart-stringify');



const initAccountClaimrewards = (params) => {
  const { transactionSend, } = params;
  const accountClaimrewards = (owner) => {
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const claimrewards = createAccountClaimrewards(owner);
      actions.push(claimrewards);

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

  return { accountClaimrewards };
}


module.exports = (params) => {
  return {
    ...initAccountClaimrewards(params),
  };
}

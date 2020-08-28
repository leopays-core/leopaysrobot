const log = require('../logger').getLogger('LeoPays:accountDelegatebw()');
const { createAccountVoteproducer } = require('./actions');
const SS = require('../lib/smart-stringify');



const initAccountVoteproducer = (params) => {
  const { transactionSend, } = params;
  const accountVoteproducer = (owner) => {
    return new Promise(async (resolve, reject) => {
      const actions = [];
      const voteproducer = createAccountVoteproducer(owner);
      actions.push(voteproducer);

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

  return { accountVoteproducer };
}


module.exports = (params) => {
  return {
    ...initAccountVoteproducer(params),
  };
}

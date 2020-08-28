const initTransactionSend = require('./transaction-send');
const accountCreate = require('./account-create');
const accountUpdateAuth = require('./account-updateauth');
const accountRegProxy = require('./account-regproxy');
const accountRegProducer = require('./account-regproducer');
const accountUnRegProducer = require('./account-unregproducer');
const tokenTransfer = require('./token-transfer');
const accountClaimrewards = require('./account-claimrewards');
const accountDelegatebw = require('./account-delegatebw');
const accountUndelegatebw = require('./account-undelegatebw');
const accountVoteproducer = require('./account-voteproducer');



const initExtendedApi = (params) => {
  const transactionSend = initTransactionSend(params);
  return {
    ...transactionSend,
    ...accountCreate({ ...params, ...transactionSend, }),
    ...accountUpdateAuth({ ...params, ...transactionSend, }),
    ...accountRegProxy({ ...params, ...transactionSend, }),
    ...accountRegProducer({ ...params, ...transactionSend, }),
    ...accountUnRegProducer({ ...params, ...transactionSend, }),
    ...tokenTransfer({ ...params, ...transactionSend, }),
    ...accountClaimrewards({ ...params, ...transactionSend, }),
    ...accountDelegatebw({ ...params, ...transactionSend, }),
    ...accountUndelegatebw({ ...params, ...transactionSend, }),
    ...accountVoteproducer({ ...params, ...transactionSend, }),
  };
}

module.exports = initExtendedApi;

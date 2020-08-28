const menuAccountCreate = require('./account-create');
const menuAccountRegProd = require('./account-regproducer');
const menuWalletTransfer = require('./token-transfer');
const menuAccountClaimrewards = require('./account-claimrewards');
const menuAccountDelegatebw = require('./account-delegatebw');
const menuAccountUnelegatebw = require('./account-undelegatebw');
const menuAccountVoteproducer = require('./account-voteproducer');



const scenes = [
  menuAccountCreate,
  menuAccountRegProd,
  menuWalletTransfer,
  menuAccountClaimrewards,
  menuAccountDelegatebw,
  menuAccountUnelegatebw,
  menuAccountVoteproducer,
];


module.exports = scenes;

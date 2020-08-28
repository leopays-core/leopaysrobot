const { createActionLinkauth } = require('./actions');
const additionalLinkauthActions = require('./linkauth-required-for-robot-additional');



const lpcMsigLinkauthActions = (account) => {
  const contract = 'lpc.msig';
  const actionNames = [
    // leopays.contracts/contracts/eosio.msig/include/eosio.msig/eosio.msig.hpp
    'propose', 'approve', 'unapprove', 'cancel', 'exec', 'invalidate'
  ];
  const actions = [];
  for (let i in actionNames)
    actions.push(createActionLinkauth(contract, actionNames[i], account));
  return actions;
}


const lpcLinkauthActions = (account) => {
  const contract = 'lpc';
  const actionNames = [
    // leopays.contracts/contracts/eosio.system/include/eosio.system/eosio.system.hpp
    'init', 'setalimits', 'setacctram', 'setacctnet', 'setacctcpu', 'activate', 'delegatebw',
    'setrex', 'deposit', 'withdraw', 'buyrex', 'unstaketorex', 'sellrex', 'cnclrexorder',
    'rentcpu', 'rentnet', 'fundcpuloan', 'fundnetloan', 'defcpuloan', 'defnetloan',
    'updaterex', 'rexexec', 'consolidate', 'mvtosavings', 'mvfrsavings', 'closerex',
    'undelegatebw', 'buyram', 'buyrambytes', 'sellram', 'refund', 'regproducer', 'unregprod',
    'setram', 'setramrate', 'voteproducer', 'regproxy', 'setparams', 'claimrewards',
    'setpriv', 'rmvproducer', 'updtrevision', 'bidname', 'bidrefund', 'setinflation',
    // leopays.contracts/contracts/eosio.system/include/eosio.system/native.hpp
    'newaccount', 'onerror', 'setabi', 'setcode',
    // leopays.contracts/contracts/eosio.system/include/eosio.system/rex.results.hpp
    'buyresult', 'sellresult', 'orderresult', 'rentresult'
  ];
  const actions = [];
  for (let i in actionNames)
    actions.push(createActionLinkauth(contract, actionNames[i], account));
  return actions;
}


const lpcTokenLinkauthActions = (account) => {
  const contract = 'lpc.token';
  const actionNames = [
    // leopays.contracts/contracts/eosio.system/include/eosio.system/native.hpp
    'create', 'issue', 'retire', 'transfer', 'open', 'close'
  ];
  const actions = [];
  for (let i in actionNames)
    actions.push(createActionLinkauth(contract, actionNames[i], account));
  return actions;
}


const lpcWrapLinkauthActions = (account) => {
  const contract = 'lpc.wrap';
  const actionNames = [
    // leopays.contracts/contracts/eosio.wrap/include/eosio.wrap/eosio.wrap.hpp
    'exec'
  ];
  const actions = [];
  for (let i in actionNames)
    actions.push(createActionLinkauth(contract, actionNames[i], account));
  return actions;
}


module.exports = (account) => {
  const actions = additionalLinkauthActions(account);

  return actions.concat(
    lpcMsigLinkauthActions(account),
    lpcLinkauthActions(account),
    lpcTokenLinkauthActions(account),
    lpcWrapLinkauthActions(account)
  );
}


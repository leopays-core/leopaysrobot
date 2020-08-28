const { processAuth } = require('./lib');
const settings = require('../../settings');
const BN = require('bignumber.js');



const createActionLinkauth = (contract, action, account) => {
  return {
    account: 'lpc',
    name: 'linkauth',
    authorization: [{
      actor: account,
      permission: 'active',
    }],
    data: {
      account: account,
      code: contract,
      type: action,
      requirement: 'leopaysrobot',
    },
  };
}


const createActionUpdateauth = ({ auth, authorization, data, }) => {
  const permission = processAuth(auth);

  const action = {
    account: 'lpc',
    name: 'updateauth',
    authorization: [],
    data: {
      account: '_',
      permission: 'leopaysrobot',
      parent: 'active',
      auth: permission,
    },
  };

  for (let i in authorization)
    action.authorization.push({ actor: authorization[i].actor, permission: authorization[i].permission });
  if (data) {
    action.data.account = data.account;
    action.data.permission = data.permission;
    action.data.parent = data.parent || 'active';
  }

  return action;
}


const createRegProxy = (proxy, isproxy) => {
  const action = {
    account: 'lpc',
    name: 'regproxy',
    authorization: [{
      actor: proxy,
      permission: 'leopaysrobot',
    }],
    data: {
      proxy: proxy,
      isproxy: isproxy,
    },
  };
  return action;
}


const createActionRegProducer = (params) => {
  const { producer, producer_key, url, location } = params;
  const action = {
    account: 'lpc',
    name: 'regproducer',
    authorization: [{
      actor: producer,
      permission: 'leopaysrobot',
    }],
    data: {
      producer, producer_key, url, location,
    },
  };
  return action;
}


const createActionUnRegProducer = (producer) => {
  const action = {
    account: 'lpc',
    name: 'unregprod',
    authorization: [{
      actor: producer,
      permission: 'leopaysrobot',
    }],
    data: {
      producer,
    },
  };
  return action;
}



const createTokenTransfer = (params = {}) => {
  const { from, to, quantity, memo } = params;

  const action = {
    account: 'lpc.token',
    name: 'transfer',
    authorization: [{
      actor: from,
      permission: 'leopaysrobot',
    }],
    data: {
      from,
      to,
      quantity,
      memo: memo || '',
    },
  };
  return action;
}


const createAccountClaimrewards = (owner) => {
  const action = {
    account: 'lpc',
    name: 'claimrewards',
    authorization: [{
      actor: owner,
      permission: 'active',
    }],
    data: {
      owner,
    },
  };
  return action;
}

const createAccountDelegatebw = (
  { from, receiver, quantity, stake_net_quantity, stake_cpu_quantity, transfer = false }
) => {
  const action = {
    account: 'lpc',
    name: 'delegatebw',
    authorization: [{
      actor: from,
      permission: 'leopaysrobot',
    }],
    data: {
      from,
      receiver,
      stake_net_quantity,
      stake_cpu_quantity,
      transfer,
    }
  };
  if (quantity) {
    let q = parseInt(quantity * 10000);
    let cpu_rate = settings.newAccount.cpu_rate;
    let cpu = parseInt((q * cpu_rate));
    let net = parseInt(q - cpu);

    net = net / 10000;
    cpu = cpu / 10000;

    action.data.stake_net_quantity = `${net.toFixed(4)} LPC`;
    action.data.stake_cpu_quantity = `${cpu.toFixed(4)} LPC`;
  }
  return action;
}

const createAccountUndelegatebw = (
  { from, receiver, unstake_net_quantity, unstake_cpu_quantity, transfer = false }
) => {
  const action = {
    account: 'lpc',
    name: 'undelegatebw',
    authorization: [{
      actor: from,
      permission: 'leopaysrobot',
    }],
    data: {
      from,
      receiver,
      unstake_net_quantity,
      unstake_cpu_quantity,
      transfer,
    }
  };
  return action;
}


const createAccountVoteproducer = (
  { voter, proxy = '', producers = [] }
) => {
  const action = {
    account: 'lpc',
    name: 'voteproducer',
    authorization: [{
      actor: voter,
      permission: 'leopaysrobot',
    }],
    data: {
      voter,
      proxy,
      producers,
    }
  };
  return action;
}



module.exports = {
  createActionLinkauth,
  createActionUpdateauth,
  createRegProxy,
  createActionRegProducer,
  createActionUnRegProducer,
  createTokenTransfer,
  createAccountClaimrewards,
  createAccountDelegatebw,
  createAccountUndelegatebw,
  createAccountVoteproducer,
};



const deleteauth = {
  account: 'lpc',
  name: 'deleteauth',
  authorization: [{
    actor: 'leopaysrobot',
    permission: 'owner',
  }],
  data: {
    account: '',
    permission: 'permission',
  },
};

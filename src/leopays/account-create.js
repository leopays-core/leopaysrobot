const linkauthRequiredForRobot = require('./linkauth-required-for-robot');
const { createRegProxy } = require('./actions');
const settings = require('../../settings');
const { newAccount } = settings;
const log = require('../logger').getLogger('LeoPays:accountCreate()');
const SS = require('../lib/smart-stringify');



const initAccountCreate = (params) => {
  const { transactionSend, } = params;
  const accountCreate = (creator = 'leopaysrobot', newAccountName) => {
    if (!newAccountName) throw new Error('New account name not specified!');
    return new Promise(async (resolve, reject) => {

      const permissionOwner = {
        threshold: 1, waits: [], keys: [],
        accounts: [{ permission: { actor: 'leopaysrobot', permission: 'leopaysrobot' }, 'weight': 1 }]
      };
      const permissionActive = {
        threshold: 1, waits: [], keys: [],
        accounts: [{ permission: { actor: 'leopaysrobot', permission: 'leopaysrobot' }, 'weight': 1 }]
      };

      const actions1 = [];
      const newaccount = {
        account: 'lpc',
        name: 'newaccount',
        authorization: [{
          actor: creator,
          permission: 'leopaysrobot',
        }],
        data: {
          creator: creator,
          name: newAccountName,
          owner: permissionOwner,
          active: permissionActive,
        },
      };
      actions1.push(newaccount);

      const buyrambytes = {
        account: 'lpc',
        name: 'buyrambytes',
        authorization: [{
          actor: 'leopaysrobot',
          permission: 'leopaysrobot',
        }],
        data: {
          payer: 'leopaysrobot',
          receiver: newAccountName,
          bytes: newAccount.bytes,
        },
      };
      actions1.push(buyrambytes);

      const delegatebw = {
        account: 'lpc',
        name: 'delegatebw',
        authorization: [{
          actor: 'leopaysrobot',
          permission: 'leopaysrobot',
        }],
        data: {
          from: 'leopaysrobot',
          receiver: newAccountName,
          stake_net_quantity: newAccount.net,
          stake_cpu_quantity: newAccount.cpu,
          transfer: false,
        }
      };
      actions1.push(delegatebw);


      let actions2 = [];
      const updateauth = {
        account: 'lpc',
        name: 'updateauth',
        authorization: [{
          actor: newAccountName,
          permission: 'active',
        }],
        data: {
          account: newAccountName,
          permission: 'leopaysrobot',
          parent: 'active',
          auth: {
            threshold: 1,
            keys: [],
            accounts: [{ permission: { actor: 'leopaysrobot', permission: 'leopaysrobot' }, 'weight': 1 }],
            waits: [],
          },
        },
      };
      actions2.push(updateauth);
      actions2 = actions2.concat(linkauthRequiredForRobot(newAccountName));


      const actions3 = [];
      const updateauth2 = {
        account: 'lpc',
        name: 'updateauth',
        authorization: [{
          actor: newAccountName,
          permission: 'active',
        }],
        data: {
          account: newAccountName,
          permission: 'active',
          parent: 'owner',
          auth: {
            threshold: 1,
            keys: [],
            accounts: [{ permission: { actor: 'leopaysrobot', permission: 'active' }, 'weight': 1 }],
            waits: [],
          },
        },
      };
      actions3.push(updateauth2);

      const updateauth3 = {
        account: 'lpc',
        name: 'updateauth',
        authorization: [{
          actor: newAccountName,
          permission: 'owner',
        }],
        data: {
          account: newAccountName,
          permission: 'owner',
          parent: '',
          auth: {
            threshold: 1,
            keys: [],
            accounts: [{ permission: { actor: 'leopaysrobot', permission: 'owner' }, 'weight': 1 }],
            waits: [],
          },
        },
      };
      actions3.push(updateauth3);


      const actions4 = [];
      const open = {
        account: 'lpc.token',
        name: 'open',
        authorization: [{
          actor: newAccountName,
          permission: 'leopaysrobot',
        }],
        data: {
          owner: newAccountName,
          symbol: '4,LPC',
          ram_payer: newAccountName,
        }
      };
      actions4.push(open);


      const regproxy = createRegProxy(newAccountName, true);
      actions4.push(regproxy);
      const unregproxy = createRegProxy(newAccountName, false);
      actions4.push(unregproxy);


      try {
        const transaction1 = await transactionSend(actions1);
        log.trace('transaction1:', SS(transaction1));
        const transaction2 = await transactionSend(actions2);
        log.trace('transaction2:', SS(transaction2));
        const transaction3 = await transactionSend(actions3);
        log.trace('transaction3:', SS(transaction3));
        const transaction4 = await transactionSend(actions4);
        log.trace('transaction4:', SS(transaction4));
        return resolve(transaction1);
      } catch (error) {
        log.error(SS(error));
        return reject(error);
      }
    });
  }

  return { accountCreate };
}


module.exports = (params) => {
  return {
    ...initAccountCreate(params),
  };
}

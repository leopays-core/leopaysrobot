const { Api, JsonRpc, RpcError } = require('leopaysjs');
const { JsSignatureProvider } = require('leopaysjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const cfg = require('../config');
const log = require('../logger').getLogger('LeoPays');
const SS = require('../lib/smart-stringify');
const initExtendedApi = require('./extended-api');
const linkauthRequiredForRobot = require('./linkauth-required-for-robot');


const init = () => {
  const chain_id = cfg.get('leopays.chain_id');
  const keys = cfg.get('leopays.keys') || [];
  const signatureProvider = new JsSignatureProvider(keys);
  const url = `${cfg.get('leopays.api_node.protocol')}://${cfg.get('leopays.api_node.host')}:${cfg.get('leopays.api_node.port')}`;
  const rpc = new JsonRpc(url, { fetch });
  const api = new Api({
    rpc, signatureProvider, chainId: chain_id,
    textDecoder: new TextDecoder(), textEncoder: new TextEncoder()
  });
  const extendedApi = initExtendedApi({ rpc, api, signatureProvider, });


  check('leopaysrobot', 'leopaysrobot')
    .then(() => check('leopays', 'leopaysrobot'))
  /*
  .then(() => check('defproducera', 'leopaysrobot'))
  .then(() => check('defproducerb', 'leopaysrobot'))
  .then(() => check('defproducerc', 'leopaysrobot'))
  .then(() => check('defproducerd', 'leopaysrobot'))
  .then(() => check('defproducere', 'leopaysrobot'))
  .then(() => check('defproducerf', 'leopaysrobot'))
  .then(() => check('defproducerg', 'leopaysrobot'))
  .then(() => check('defproducerh', 'leopaysrobot'))
  .then(() => check('defproduceri', 'leopaysrobot'))
  .then(() => check('defproducerj', 'leopaysrobot'))
  .then(() => check('defproducerk', 'leopaysrobot'))
  .then(() => check('defproducerl', 'leopaysrobot'))
  .then(() => check('defproducerm', 'leopaysrobot'))
  .then(() => check('defproducern', 'leopaysrobot'))
  .then(() => check('defproducero', 'leopaysrobot'))
  .then(() => check('defproducerp', 'leopaysrobot'))
  .then(() => check('defproducerq', 'leopaysrobot'))
  .then(() => check('defproducerr', 'leopaysrobot'))
  .then(() => check('defproducers', 'leopaysrobot'))
  .then(() => check('defproducert', 'leopaysrobot'))
  .then(() => check('defproduceru', 'leopaysrobot'));*/

  return {
    rpc,
    api,
    signatureProvider,
    ...extendedApi,
  };

  async function check(account = 'leopaysrobot', permission = 'leopaysrobot') {
    try {
      const acc = await rpc.get_account(account);
      log.trace(`account ${account}:`, SS(acc));
      const pubKeys = await signatureProvider.getAvailableKeys();
      let hasKey = false;
      for (let i in acc.permissions) {
        for (let k in acc.permissions[i].required_auth.keys) {
          const tmpl = acc.permissions[i].required_auth.keys[k].key.substring(3, 47);
          const regexp = new RegExp(`\\w+${tmpl}\\w+`);
          for (let j in pubKeys)
            if (regexp.test(pubKeys[j]))
              hasKey = true;
        }
      }

      if (!hasKey)
        return;

      let permissionFinded = false;
      for (let i in acc.permissions)
        if (acc.permissions[i].perm_name === permission) permissionFinded = true;
      if (!permissionFinded) {
        const params = {
          auth: {
            threshold: 1, waits: [],
            accounts: [{ permission: { actor: 'leopaysrobot', permission: 'leopaysrobot' }, weight: 1 }],
            keys: [],
          },
          authorization: [{ actor: account, permission: 'active' }],
          data: { account: account, permission: permission, parent: 'active' },
        }

        if (account === 'leopaysrobot') {
          params.auth.keys.push({ key: "LPC6gigAiA24gPDJTnD2uU8EQJg6xDrQicHdQw3uPHBmzNgYdNHm6", weight: 1 });
          delete params.auth.accounts;
        } else {
          delete params.auth.keys;
        }
        const transaction1 = await extendedApi.accountUpdateAuth(params);

        log.trace(`Permission "${account}@${permission}" updated. transaction:`, SS(transaction1));
        log.info(`Permission "${account}@${permission}" updated.`);

        const transaction2 = await extendedApi.transactionSend(linkauthRequiredForRobot(account));
        log.trace(`Required linkauth for "${account}@${permission}". transaction:`, SS(transaction2));
        log.info(`Required linkauth for "${account}@${permission}" updated.`);
      }
    } catch (error) {
      log.error(`check permission for ${account}@${permission} failed. error:`, SS(error));
      process.exit(1);
    }
  }
}


module.exports = init();
module.exports.init = init;

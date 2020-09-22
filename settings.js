const cfg = require('./src/config');

const company = {
  url: 'https://leopays.com/', name: 'Leopays', title: 'LeoPays',
};



const node = { protocol: cfg.get('leopays.node.protocol'), host: cfg.get('leopays.node.host'), port: cfg.get('leopays.node.port'), };
//const hyperion = { protocol: 'https', host: 'node.leopays.dev', port: 8080, };

const localNode = { protocol: 'http', host: 'localhost', port: 8888, };
//const localHyperion = { protocol: 'http', host: 'localhost', port: 8080, };

let explorerUrl = 'https://explorer.leopays.dev';
if (cfg.get('leopays.network') === 'testnet') {
  explorerUrl = 'https://explorer.testnet.leopays.dev';
}
const explorer = {
  global: { url: explorerUrl, query: '', },
  local: { url: explorerUrl, query: '', },
};

// https://hyperion.docs.eosrio.io/hyperion/
let hyperionUrl = 'https://hyperion.leopays.dev';
if (cfg.get('leopays.network') === 'testnet') {
  hyperionUrl = 'https://hyperion.testnet.leopays.dev';
}
const hyperion = {
  url: hyperionUrl,
};



const constants = {
  network: 'network',
  networkL3: 'net',
  networkL1: 'n',

  affiliate: 'affiliate',
  affiliateL3: 'aff',

  account: 'account',
  accountL3: 'acc',
  accountL1: 'a',

  wallet: 'wallet',
  walletL3: 'wlt',
  walletL1: 'w',

  about: 'about',
  aboutL3: 'abt',

  settings: 'settings',
  settingsL3: 'sts',
  settingsL1: 's',

  users: 'users',
  usersL3: 'usr',
  usersL1: 'u',
}

const public_name = {
  enabled: true,
  first: true,
  middle: true,
  last: true,
  random_number: true,
  random_number_max: 999,
  max_length: 32,
};


const newAccountDefaultCreator = 'leopaysrobot';
const newAccount = {
  bytes: 25000,
  net: '0.2000 LPC',
  cpu: '0.8000 LPC',
  cpu_rate: 4 / 5,
};
const maxAccountsPerUser = 1;
const newAccountTestnetBounty = `10000.0000 LPC`;


module.exports = {
  node,
  localNode,
  explorer,
  hyperion,
  c: constants,
  public_name,
  company,

  newAccount,
  newAccountDefaultCreator,
  maxAccountsPerUser,
  newAccountTestnetBounty,
};


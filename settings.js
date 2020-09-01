const cfg = require('./src/config');

const company = {
  url: 'https://leopays.com/', name: 'Leopays', title: 'LeoPays',
};



const node = { protocol: cfg.get('leopays.node.protocol'), host: cfg.get('leopays.node.host'), port: cfg.get('leopays.node.port'), };
//const hyperion = { protocol: 'https', host: 'node.leopays.dev', port: 8080, };

const localNode = { protocol: 'http', host: 'localhost', port: 8888, };
//const localHyperion = { protocol: 'http', host: 'localhost', port: 8080, };

//const global_query = `?nodeUrl=${node.protocol}%3A%2F%2F${node.host}%3A${node.port}&coreSymbol=LPC&corePrecision=4&systemDomain=lpc&hyperionUrl=${hyperion.protocol}%3A%2F%2F${hyperion.host}%3A${hyperion.port}`;
const global_query = `?nodeUrl=${node.protocol}%3A%2F%2F${node.host}%3A${node.port}&coreSymbol=LPC&corePrecision=4&systemDomain=lpc`;
//const local_query = `?nodeUrl=${localNode.protocol}%3A%2F%2F${localNode.host}%3A${localNode.port}&coreSymbol=LPC&corePrecision=4&systemDomain=lpc&hyperionUrl=${localHyperion.protocol}%3A%2F%2F${localHyperion.host}%3A${localHyperion.port}`;
const local_query = `?nodeUrl=${localNode.protocol}%3A%2F%2F${localNode.host}%3A${localNode.port}&coreSymbol=LPC&corePrecision=4&systemDomain=lpc`;

const explorer = {
  global: { url: 'https://local.bloks.io', query: global_query, },
  local: { url: 'https://local.bloks.io', query: local_query, },
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
const maxAccountsPerUser = 10;


module.exports = {
  node, //hyperion,
  localNode, //localHyperion,
  explorer,
  c: constants,
  public_name,
  company,

  newAccount,
  newAccountDefaultCreator,
  maxAccountsPerUser,

};


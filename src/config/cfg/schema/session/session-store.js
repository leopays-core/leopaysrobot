const isProd = process.env.NODE_ENV === 'production';



// Define a schema
const schema = {
  host: {
    doc: "The IP address of redis server",
    format: "*",
    default: "127.0.0.1", // localhost:27017 // 127.0.0.1:27017
    env: "SESSION_STORE_HOST",
    arg: "session-store-host",
  },
  port: {
    doc: "The port of redis server",
    format: "port",
    default: 6379, // 6379
    env: "SESSION_STORE_PORT",
    arg: "session-store-port",
  },
  secret: {
    doc: "session store secret",
    format: String,
    default: isProd ? undefined : "keyboard^cat",
  },
  algorithm: {
    doc: "session store algorithm (Allows for changes to the default symmetric encryption cipher; default is GCM. See crypto.getCiphers() for supported algorithms.)",
    format: String,
    default: "GCM",
  },
  hashing: {
    doc: "session store hashing (May be used to change the default hashing algorithm; default is sha512. See crypto.getHashes() for supported hashing algorithms.)",
    format: String,
    default: "sha512",
  },
  encodeas: {
    doc: "session store encodeas (Specify to change the session data cipher text encoding.Default is hex.)",
    format: String,
    default: "hex",
  },
  key_size: {
    doc: "session store key_size (When using varying algorithms the key size may be used.Default is 32 based on the AES blocksize.)",
    format: Number,
    default: 32,
  },
  iv_size: {
    doc: "session store iv_size (This can be used to adjust the default IV size if a different algorithm requires a different size.Default is 16.)",
    format: Number,
    default: 16,
  },
  at_size: {
    doc: "session store at_size (When using newer AES modes such as the default GCM or CCM an authentication tag size can be defined; default is 16.)",
    format: Number,
    default: 16,
  },
  ttl: {
    doc: "session ttl",
    format: Number,
    default: isProd ? 1 * 60 * 60 : 10 * 60, // (default: 86400 seconds or one day)
  },
};

module.exports = schema;

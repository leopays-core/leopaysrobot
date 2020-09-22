const isProd = process.env.NODE_ENV === 'production';



// Define a schema
const schema = {
  leopays: {
    network: {
      doc: "LeoPays network mode",
      format: ["testnet", "mainnet"],
      default: "testnet",
    },
    keys: {
      doc: "LeoPays private keys",
      format: Array,
      default: [],
      env: "LPC_KEYS",
      arg: "lpc-keys",
    },
    node: {
      protocol: {
        doc: "Connection protocol.",
        format: ["https", "http"],
        default: "http",
        env: "LPC_NODE_PROTOCOL",
        arg: "lpc-node-protocol",
      },
      host: {
        doc: "The IP address to bind.",
        format: "*",
        default: "127.0.0.1", // 'localhost',
        env: "LPC_NODE_HOST",
        arg: "lpc-node-host",
      },
      port: {
        doc: "The port to bind.",
        format: "port",
        default: 8888,
        env: "LPC_NODE_PORT",
        arg: "lpc-node-port",
      },
    },
    api_node: {
      protocol: {
        doc: "Connection protocol.",
        format: ["https", "http"],
        default: "http",
        env: "LPC_API_NODE_PROTOCOL",
        arg: "lpc-api-node-protocol",
      },
      host: {
        doc: "The IP address to bind.",
        format: "*",
        default: "127.0.0.1", // 'localhost',
        env: "LPC_API_NODE_HOST",
        arg: "lpc-api-node-host",
      },
      port: {
        doc: "The port to bind.",
        format: "port",
        default: 8888,
        env: "LPC_API-NODE_PORT",
        arg: "lpc-api-node-port",
      },
    },
  },
};

module.exports = schema;

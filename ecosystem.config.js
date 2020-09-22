module.exports = {
  apps: [{
    name: "LeoPaysRoBot",
    script: './bin/leopaysrobot',
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
    //watch: '.'
  }],
};

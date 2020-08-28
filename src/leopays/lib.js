

const processAuth = (auth = { keys, accounts, threshold: 1 }) => {
  const permission = {
    threshold: auth.threshold ? auth.threshold : 1,
    keys: [],
    accounts: [],
    waits: [],
  };

  if (auth.keys !== undefined)
    if (Array.isArray(auth.keys) && auth.keys.length > 0)
      for (let i in auth.keys)
        permission.keys.push({
          key: auth.keys[i].key,
          weight: auth.keys[i].weight ? auth.keys[i].weight : 1,
        });

  if (auth.accounts !== undefined)
    if (Array.isArray(auth.accounts) && auth.accounts.length > 0)
      for (let i in auth.accounts)
        permission.accounts.push({
          permission: {
            actor: auth.accounts[i].permission.actor,
            permission: auth.accounts[i].permission.permission,
          },
          weight: auth.accounts[i].weight ? auth.accounts[i].weight : 1,
        });

  return permission;
}
module.exports.processAuth = processAuth;

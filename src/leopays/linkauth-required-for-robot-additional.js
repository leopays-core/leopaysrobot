const { createActionLinkauth } = require('./actions');



const additionalLinkauthActions = (account) => {
  const contract = 'contract';
  const actionNames = [];
  const actions = [];
  for (let i in actionNames)
    actions.push(createActionLinkauth(contract, actionNames[i], account));
  return actions;
}


module.exports = additionalLinkauthActions;

const randomName = require('random-name');



async function getRendomPublicName(user, settings) {
  const { public_name: spn } = settings;
  let doIt = true;
  let public_name = '';

  while (doIt) {
    public_name = '';

    if (spn.first)
      public_name += randomName.first();

    if (spn.middle)
      public_name += randomName.middle();

    if (spn.last)
      public_name += randomName.last();

    if (spn.random_number)
      public_name += parseInt(Math.random() * spn.random_number_max);

    if (public_name.length <= spn.max_length) {
      if (await TGUser.findOne({ public_name }) === null)
        doIt = false;
    }
  }

  return public_name;
}

module.exports = getRendomPublicName;

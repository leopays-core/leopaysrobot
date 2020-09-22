const mongoose = require('mongoose');
const TGUser = mongoose.model('TGUser');
const Language = mongoose.model('Language');
const logger = require('../../logger');



const log = logger.getLogger('db');


async function setTGUserLanguageCode(_id, code) {
  log.trace('setTGUserLanguageCode. _id:', _id);

  let result = await TGUser.findByIdAndUpdate(
    _id,
    { language: code, },
    { new: true, upsert: true, }
  );

  if (result !== null)
    result = result.toJSON();
  log.trace('setTGUserLanguageCode, result:', result);
  return result;
}


async function getLanguagesSortedList(params = { limit: 20, offset: 0, }) {
  log.trace('getLanguagesSortedList');
  let result = {
    count: 0,
    limit: parseInt(params.limit) || 20,
    offset: parseInt(params.offset) || 0,
    list: [],
  };
  try {
    result.count = await Language.find({ enabled: true, visible: true })
      .count();

    if (result.count <= params.limit) {
      result.offset = 0;
      params.offset = 0;
    }

    result.list = await Language.find({ enabled: true, visible: true })
      .sort({ serial_number: -1 })
      .skip(params.offset)
      .limit(params.limit);
  } catch (error) {
    log.error('getLanguagesSortedList, error:', error);
  }

  log.trace('getLanguagesSortedList, result:', result);
  return result;
}

module.exports = {
  setTGUserLanguageCode,
  getLanguagesSortedList,
  log,
};

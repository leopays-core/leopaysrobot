const fs = require('fs');
const path = require('path');
const localeEmoji = require('locale-emoji');
const { getUnicode } = require('countries-list');
// https://github.com/annexare/Countries
// https://raw.githubusercontent.com/annexare/Countries/master/dist/data.json
const languages0JSON = require('./data.json').languages;


let temp = {};

const keys = Object.keys(languages0JSON)
for (let i in keys) {
  const list = Object.assign({}, { _id: languages0JSON[keys[i]].code }, temp[keys[i]], languages0JSON[keys[i]]);
  const keysSorted = Object.keys(list).sort();
  let newList = {};
  for (k in keysSorted) {
    newList._id = keys[i];
    newList.code = keys[i];
    newList.emoji = localeEmoji(keys[i]);
    newList.emoji_unicode = getUnicode(newList.emoji);
    newList[keysSorted[k]] = list[keysSorted[k]];
  }
  temp[keys[i]] = newList;
}

let language = {};
const keysSorted = Object.keys(temp).sort();
for (k in keysSorted)
  language[keysSorted[k]] = temp[keysSorted[k]];

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './languages.json'),
    JSON.stringify(language, null, 2)
  );

module.exports = language;

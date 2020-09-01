function stringToBoolean(str) {
  if (str === undefined) return false;
  str = `${str}`;
  switch (str.toLowerCase().trim()) {
    case 'true': case 'yes': case '1': return true;
    case 'false': case 'no': case '0': case '': case null: return false;
    default: return Boolean(str);
  }
}

module.exports = stringToBoolean;

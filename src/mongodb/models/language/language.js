// https://github.com/annexare/Countries
// https://github.com/annexare/Countries/blob/master/dist/data.json
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const logger = require('../../../logger');



const modelName = 'Language';
const log = logger.getLogger('mongoose: ' + modelName);

const schema = new Schema({
  // _id = code
  _id: { type: String, required: true, trim: true, index: true, unique: true, },
  id: { type: Number, index: true, unique: true, },
  code: { type: String, required: true, trim: true, index: true, unique: true, },

  enabled: { type: Boolean, index: true, sparse: true, },
  visible: { type: Boolean, index: true, sparse: true, },
  serial_number: { type: Number, index: true, sparse: true, },

  name: { type: String, trim: true, },
  native: { type: String, trim: true, },
  emoji: { type: String, trim: true, },
  emoji_unicode: { type: String, trim: true, },
}, {
  versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.plugin(
  AutoIncrement,
  { id: 'Language', inc_field: 'id', start_seq: 1, },
);

schema.pre('save', async function (next) {
  log.trace('pre "save": "{"doc":%s}"', JSON.stringify(this));
  return next();
});


const model = mongoose.model(modelName, schema);

model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = require('./languages');
    const keys = Object.keys(docs);
    for (let i in keys) {
      // Включение всех
      docs[keys[i]].enabled = false;
      docs[keys[i]].visible = false;
      if (keys[i] === 'ru') {
        docs[keys[i]].enabled = true;
        docs[keys[i]].visible = true;
        docs[keys[i]].serial_number = -1;
      }
      if (keys[i] === 'en') {
        docs[keys[i]].enabled = true;
        docs[keys[i]].visible = true;
        docs[keys[i]].serial_number = -2;
      }
      await model.create(docs[keys[i]]);
    }
  }
  log.trace('Ok');
});


module.exports = model;
module.exports.schema = schema;

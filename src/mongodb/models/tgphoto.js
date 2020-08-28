const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../../logger');



const modelName = 'TGPhoto';
const log = logger.getLogger('mongoose: ' + modelName);

const schema = new Schema({
  file_id: { type: String, trim: true, index: true, unique: true, },
  file_unique_id: { type: String, trim: true, index: true, },
  file_size: { type: Number, },
  width: { type: Number, },
  height: { type: Number, },
}, {
  versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.pre('save', function (next) {
  log.debug(`pre 'save': "{"doc":%s}"`, JSON.stringify(this));
  return next();
});


module.exports = mongoose.model(modelName, schema);
module.exports.schema = schema;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('../../logger');
const tgUsers = require('./tgusers.json');



const modelName = 'TGUser';
const log = logger.getLogger('mongoose: ' + modelName);

const schema = new Schema({
  id: { type: Number, required: true, index: true, unique: true, },

  is_bot: { type: Boolean, index: true, sparse: true, },
  type: { type: String, trim: true, index: true, sparse: true, },

  first_name: { type: String, trim: true, },
  last_name: { type: String, trim: true, },
  username: { type: String, trim: true, },
  language_code: { type: String, trim: true, index: true, sparse: true, },

  photo: {
    small_file_id: { type: String, trim: true, },
    small_file_unique_id: { type: String, trim: true, },
    big_file_id: { type: String, trim: true, },
    big_file_unique_id: { type: String, trim: true, },
  },
  photos: [],

  last_active_at: { type: Date, default: Date.now, },
  public_name: { type: String, trim: true, index: true, sparse: true, },
  status: {
    agreed: { type: Boolean, index: true, sparse: true, default: false, },
    blocked: { type: Boolean, index: true, sparse: true, default: false, },
  },
  redirect: { type: String, trim: true, default: null, },

  language: { type: String, ref: 'Language', lowercase: true, trim: true, index: true, sparse: true, },
  accounts: [{ type: String, lowercase: true, trim: true, }],
  account_main: { type: String, lowercase: true, trim: true, },
  parent: { type: Number, index: true, sparse: true, },
  referrals: {
    count: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  permissions: {
    root: { type: Boolean, index: true, sparse: true, default: false, },
    admin: { type: Boolean, index: true, sparse: true, default: false, },
  },
}, {
  versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.pre('save', function (next) {
  log.debug(`pre 'save': "{"doc":%s}"`, JSON.stringify(this));
  return next();
});

schema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const options = this.getOptions();
  const update = this.getUpdate();
  /*log.trace(
    `pre 'findOneAndUpdate': "{"query":%s,"options":%s,"update":%s}"`,
    JSON.stringify(query), JSON.stringify(options), JSON.stringify(update)
  );*/
  return next();
})


const model = mongoose.model(modelName, schema);


model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = tgUsers || [];
    if (docs.length > 0)
      await model.create(docs);
  }
  log.trace('Ok');
});


module.exports = model;
module.exports.schema = schema;

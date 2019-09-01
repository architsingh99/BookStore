const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ["Active", "Inactive"];

const BookSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  price: {type: Number, default: 0 },
  ISBN: {type: Number, default: 0 },
  stock: {type: Number, default: 0 },
  author: { type: String, default: '' },
  isDeleted: {type: Boolean, default: false, enum: [true, false]},
  status: { type: String, default: "Active", enum: status },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

// For pagination
BookSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Book', BookSchema);
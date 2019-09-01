const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ["Active", "Inactive"];

const PurchaseSchema = new Schema({
  email: { type: String, default: '' },
  isDeleted: {type: Boolean, default: false, enum: [true, false]},
  status: { type: String, default: "Active", enum: status },
  book_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

// For pagination
PurchaseSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Purchase', PurchaseSchema);
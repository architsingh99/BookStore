var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const deleted = [true, false];

var UserSchema = new Schema({
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },

  email: { type: String, default: '' },
  password: { type: String, default: '' },
  isEmailVerified: { type: Boolean, default: false, enum: [true,false] },
  verification_code: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false, enum: deleted },
  isActive: { type: Boolean, default:true, enum:[true,false] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password,checkPassword);
  //bcrypt.compare(jsonData.password, result[0].pass
};


// For pagination
UserSchema.plugin(mongooseAggregatePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);
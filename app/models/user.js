var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var bcrypt= require('bcrypt-nodejs');




var UserSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
  phone: {type: String, required: true , unique: true },
  name: {type: String }
});

UserSchema.pre('save', function(next) {
  // do stuff
  var user = this;
  bcrypt.hash(user.password, null, null, function(err, hash){
    if (err) return next(err);
    user.password=hash;
    next();
  });



});
// Attach some mongoose hooks
UserSchema.plugin(titlize, {
  paths: [ 'name' ]
});

UserSchema.methods.comparePassword = function(password){

  return bcrypt.compareSync(password,this.password);
};




module.exports = mongoose.model('User', UserSchema);

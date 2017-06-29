var mongoose= require('mongoose');
var Schema = mongoose.Schema;
var bcrypt= require('bcrypt-nodejs');

var ItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  email: { type: String, lowercase: true, required: true },
  phone: {type: String, required: true },
  name: {type: String },
  img: {type: String },
//  img1 : { data: Buffer, contentType: String },
//  img2 : { data: Buffer, contentType: String },
//  img3 : { data: Buffer, contentType: String },
//  img4 : { data: Buffer, contentType: String },
//  img5 : { data: Buffer, contentType: String },
  date : { type: Date, default: Date.now },
  price : {type: Number, required: true, min: 10 }
});



module.exports = mongoose.model('Items', ItemSchema);

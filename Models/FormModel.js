const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const ContactSchema = new Schema({
  name:String,
  email:String,
  phone:String,
  query:String,
}, {
  timestamps: true,
});

const ContactModel = model('Contact', ContactSchema);

module.exports = ContactModel;
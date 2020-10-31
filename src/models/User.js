const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  username: String,
  email: {type: String, unique},
  password: String,
});

module.export = model('User', userSchema);

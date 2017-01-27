const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const UserSchema = new Schema({
   email: {
     type: String,
     required: true,
     unique: true,
     lowercase: true,
     match: emailRegex
   },
   password: {
     type: String,
     required: true ,
     minlength: [8, 'Password must be between 8 and 99 characters'],
     maxlength: [99, 'Password must be between 8 and 99 characters'],
   },
   isAdmin: {
     type: Boolean,
     default: false,
   },
   tripsBooked: [{ type: Schema.ObjectId, ref: "Trip"}],
 });

 UserSchema.pre('save', function(next) {
   let user = this;
   if (!user.isModified('password')) return next();
   var hash = bcryptjs.hashSync(user.password, 10);
   user.password = hash;
   next();
});

UserSchema.methods.validPassword = function(password) {
  return bcryptjs.compareSync(password, this.password);
};

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
};
 module.exports = mongoose.model("User", UserSchema);

const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  first_name: {
      type: String,
      required: true
  },
  last_name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true
  },
  posts: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Blog"
  }]
})

// Hash the password before a user is saved to the database
userSchema.pre(
    "save",
    async function(next) {
      if (!this.isModified('password')) {
        next();
        return;
      }

      const user = this;
      const hash = await bcrypt.hash(user.password, 10);
      
      this.password = hash;
      next();
    }
  )
  
  // checks if the password entered matches the hashed password in the database
  userSchema.methods.validPassword = async function(password) {
    const user = this;
    const result = await bcrypt.compare(password, user.password);
    return result;
  }

const User = model('User', userSchema);

module.exports = User;
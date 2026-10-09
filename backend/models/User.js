const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Premium Analyst",
  },
  location: {
    type: String,
    default: "India",
  },
  status: {
    type: String,
    default: "Active",
  },
  bio: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  joined: {
    type: String,
    default: () => new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

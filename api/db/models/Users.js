const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    customer_name: { type: String, required: true },
    phone_number: String,
    refresh_token: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Şifre hashleme middleware
schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Şifre karşılaştırma metodu
schema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

class Users extends mongoose.Model {}

schema.loadClass(Users);
module.exports = mongoose.model("users", schema);

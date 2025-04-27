const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    service: { type: String, required: true }, // örnek: "Saç Kesimi", "Sakal Tıraşı"
    date: { type: Date, required: true }, // Randevu tarihi ve saati
    notes: { type: String }, // Opsiyonel not
    is_approved: { type: Boolean, default: false }, // Randevu onaylandı mı
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
class Appoinstments extends mongoose.model {}

schema.loadClass(Appoinstments);
module.exports = mongoose.model("appoinstments", schema);

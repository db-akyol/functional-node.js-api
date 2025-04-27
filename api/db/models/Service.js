const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Örn: Saç Kesimi
    price: { type: Number, required: true }, // Örn: 150 TL
    duration: { type: Number, required: true }, // Dakika cinsinden süre, Örn: 30 dakika
    description: { type: String }, // Hizmet açıklaması opsiyonel
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
class Service extends mongoose.Model {}

schema.loadClass(Service);
module.exports = mongoose.model("service", schema);

// models/Manager.js
const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone_no: String,
  password: String,
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  role: { type: String, default: "manager" }
});

module.exports = mongoose.model("Manager", managerSchema);

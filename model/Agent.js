// models/Agent.js
const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: String,
  phone_no: String,
  status: { type: String, default: "active" },
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Agent", agentSchema);

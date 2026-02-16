const PickupRequest = require("../model/PickupRequest");
const User = require("../model/User");
const { v4: uuidv4 } = require("uuid");


const createPickup = async (req, res) => {
  try {
    const { userId, region_Id } = req.body;

    // 1️⃣ Validate user
    const user = await User.findOne({ userId});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Create pickup
    const pickup = new PickupRequest({
      userId: req.body.userId,
      region_Id: req.body.region_Id,
      phone: req.body.phone,
      waste_type: req.body.waste_type,
      estimated_weight: req.body.estimated_weight,
      pickup_address: req.body.pickup_address,
      preferred_date: req.body.preferred_date,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await pickup.save();

    res.status(201).json({ message: "Pickup request created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPickup };
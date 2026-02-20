const PickupRequest = require("../model/PickupRequest");

const updatePickup = async (req, res) => {
  try {

    const updateData = {
      additional_phone_no: req.body.additional_phone_no || null,
      category: req.body.category,
      waste_description: req.body.waste_description,
      estimated_weight: req.body.estimated_weight,
      pickup_address: req.body.pickup_address,
      preferred_date: req.body.preferred_date
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await PickupRequest.findOneAndUpdate(
      { pickupRequest_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    res.json({ message: "Pickup updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updatePickup };
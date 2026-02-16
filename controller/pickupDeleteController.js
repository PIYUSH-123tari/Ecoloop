const PickupRequest = require("../model/PickupRequest");

const deletePickup = async (req, res) => {
  try {
    const deleted = await PickupRequest.findOneAndDelete({
      pickupRequest_id: req.params.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    res.json({ message: "Pickup deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { deletePickup };

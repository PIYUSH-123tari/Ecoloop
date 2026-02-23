// Ecoloop/controller/pickupDeleteController.js

const PickupRequest = require("../model/PickupRequest");
const PickupLog     = require("../model/PickupLog");
const Manager         = require("../model/Manager");

const deletePickup = async (req, res) => {
  try {
    const existing = await PickupRequest.findOne({ pickupRequest_id: req.params.id })
      .populate("user", "name email")
      .populate("category", "category_name");

    if (!existing) return res.status(404).json({ message: "Pickup not found" });

    // Delete (your original logic unchanged)
    await PickupRequest.findOneAndDelete({ pickupRequest_id: req.params.id });

    // Log deletion — use admin_Id string
    const admin = await Manager.findOne({ region_Id: existing.region_Id });
    if (admin) {
      await PickupLog.create({
        admin:     admin.admin_Id,   // String like "admin-north-goa"
        user:      existing.user._id || existing.user,
        requestId: existing._id,
        type:      "delete",
        message:   `${existing.user?.name || "A user"} deleted their pickup request (${existing.category?.category_name || "N/A"} — "${existing.waste_description?.slice(0, 40)}…").`,
        snapshot: {
          category:    existing.category?.category_name || null,
          description: existing.waste_description,
          weight:      existing.estimated_weight,
          address:     existing.pickup_address,
          date:        existing.preferred_date,
        }
      });
    }

    res.json({ message: "Pickup deleted successfully" });

  } catch (err) {
    console.error("deletePickup error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { deletePickup };
const PickupRequest = require("../model/PickupRequest");
const User = require("../model/User");

const getUserPickups = async (req, res) => {
  try {
    const { userId } = req.params;

    // find user first using UUID
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pickups = await PickupRequest.find({ user: user._id })
      .populate("category", "category_name rate_per_kg")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pickup requests" });
  }
};

module.exports = { getUserPickups };
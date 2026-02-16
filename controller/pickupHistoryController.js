const PickupRequest = require("../model/PickupRequest");

const getUserPickups = async (req, res) => {
  try {
    const { userId } = req.params;

    const pickups = await PickupRequest.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(pickups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pickup requests" });
  }
};

module.exports = { getUserPickups };

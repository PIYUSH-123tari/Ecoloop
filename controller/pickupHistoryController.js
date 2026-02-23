const PickupRequest = require("../model/PickupRequest");
const Assignment = require("../model/Assignment");
const User = require("../model/User");

// GET all pickup requests for a user
const getUserPickups = async (req, res) => {
  try {
    const userId = req.params.userId;

    // userId from localStorage is a string (UUID), not a MongoDB ObjectId
    // So first find the User document to get their _id
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pickups = await PickupRequest.find({ user: user._id })
      .populate("category", "category_name")
      .sort({ createdAt: -1 });

    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET assignment details for a specific pickupRequest (by pickupRequest_id string)
const getAssignmentByPickupId = async (req, res) => {
  try {
    const { pickupRequestId } = req.params;

    // Find the pickup by its custom string ID
    const pickup = await PickupRequest.findOne({ pickupRequest_id: pickupRequestId });

    if (!pickup) {
      return res.status(404).json({ error: "Pickup request not found" });
    }

    // Find assignment and populate agent (only passport_photo, NOT adhar_photo)
    const assignment = await Assignment.findOne({ pickupRequest: pickup._id })
      .populate("agent", "agent_name agent_phoneNo passport_photo");

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({
      assigned_date: assignment.assigned_date,
      assigned_time: assignment.assigned_time,
      agent: {
        name: assignment.agent.agent_name,
        phone: assignment.agent.agent_phoneNo,
        passport_photo: assignment.agent.passport_photo  // served from admin port 3500
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserPickups, getAssignmentByPickupId };
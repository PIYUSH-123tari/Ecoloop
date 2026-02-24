const express = require("express");
const router = express.Router();
const { 
  getUserPickups, 
  getAssignmentByPickupId, 
  getCollectedByPickupId  // ADD THIS
} = require("../controller/pickupHistoryController");

// GET all pickups for a user
router.get("/user/:userId", getUserPickups);

// GET assignment details for a pickup (status = assigned)
router.get("/assignment/:pickupRequestId", getAssignmentByPickupId);

// GET collected details for a pickup (status = collected)  ← ADD THIS
router.get("/collected/:pickupRequestId", getCollectedByPickupId);

module.exports = router;
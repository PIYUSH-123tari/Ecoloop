const express = require("express");
const router = express.Router();
const { getUserPickups, getAssignmentByPickupId } = require("../controller/pickupHistoryController");

// GET all pickups for a user
router.get("/user/:userId", getUserPickups);

// GET assignment details for a pickup (used on detail page when status = assigned)
router.get("/assignment/:pickupRequestId", getAssignmentByPickupId);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getRewardBalance } = require("../controller/RewardController");

// GET /reward/:userId
router.get("/:userId", getRewardBalance);

module.exports = router;
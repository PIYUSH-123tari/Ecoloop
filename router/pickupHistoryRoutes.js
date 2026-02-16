const express = require("express");
const router = express.Router();
const { getUserPickups } = require("../controller/pickupHistoryController");

router.get("/user/:userId", getUserPickups);

module.exports = router;

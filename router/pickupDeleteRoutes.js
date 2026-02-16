const express = require("express");
const router = express.Router();
const { deletePickup } = require("../controller/pickupDeleteController");

router.delete("/:id", deletePickup);

module.exports = router;

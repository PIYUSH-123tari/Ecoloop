const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const pickupController = require("../controller/pickupController");

const PickupRequest = require("../model/PickupRequest");

router.post(
  "/create",
  upload.single("image"),
  pickupController.createPickup
);

router.get("/:id", async (req, res) => {
  const pickup = await PickupRequest.findOne({
    pickupRequest_id: req.params.id
  });
  res.json(pickup);
});






module.exports = router;

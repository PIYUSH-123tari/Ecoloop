const express = require("express");
const router = express.Router();
const userProfileController = require("../controller/userProfileController");
const upload = require("../middleware/uploadMiddleware");

// GET user profile
router.get("/:id", userProfileController.getUserProfile);



router.put("/:id", upload.single("photo"), userProfileController.updateUserProfile);

module.exports = router;

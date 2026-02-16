const express = require("express");
const router = express.Router();
const { registerUser,logoutUser,loginController } = require("../controller/userController");

router.post("/register", registerUser);
router.get("/logout",logoutUser);
router.post("/login",loginController);
module.exports = router;

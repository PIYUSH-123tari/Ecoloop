const User = require("../model/User");

// GET USER USING _id (from localStorage)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

   const user = await User.findOne({ userId: userId });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      region_Id: req.body.region_Id
    };

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const user = await User.findOneAndUpdate(
      { userId: userId },
      updatedData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};

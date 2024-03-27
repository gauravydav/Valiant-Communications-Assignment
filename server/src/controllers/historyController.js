const UploadHistory = require("../models/UploadHistory");

exports.getUploadHistory = async (req, res) => {
  try {
    const uploadHistories = await UploadHistory.find({})
      .populate("student", "name email")
      .lean();
    if (!uploadHistories.length) {
      return res.status(404).json({ message: "No upload histories found" });
    }

    res.status(200).json(uploadHistories);
  } catch (error) {
    console.error("Error fetching upload history:", error.message);
    res.status(500).json({ message: "Failed to fetch upload history" });
  }
};

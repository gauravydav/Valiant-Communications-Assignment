const fs = require("fs");
const path = require("path");
const multer = require("multer");
const UploadHistory = require("../models/UploadHistory");

const uploadDirectory = "uploads/";

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = "resume_" + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Only PDF files are allowed!");
  },
}).single("resume");

exports.submitDetails = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Error uploading file", error: err.message });
      } else if (err) {
        return res.status(500).json({ message: "Server Error", error: err.message });
      }

      const { name, email, contactNumber } = req.body;

      const uploadHistory = new UploadHistory({
        name: name,
        email: email,
        contactNumber: contactNumber,
        resumeUrl: req.file.path,
      });

      await uploadHistory.save();

      return res.status(200).json({ message: "Student details and resume uploaded successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

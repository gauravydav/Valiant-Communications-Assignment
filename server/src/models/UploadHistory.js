const mongoose = require('mongoose');

const uploadHistorySchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  uploadDateTime: { type: Date, default: Date.now },
  resumeUrl: { type: String, required: true },
});

const UploadHistory = mongoose.model('UploadHistory', uploadHistorySchema);

module.exports = UploadHistory;

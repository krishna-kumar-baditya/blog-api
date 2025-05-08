const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'blogpost', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('comment', commentSchema);

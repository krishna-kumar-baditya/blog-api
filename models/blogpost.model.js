const mongoose = require("mongoose");

const BlogPostsSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: [{ type: String, required: true }],
        likes: {
            type: Number,
            default: 0,
        },
        isDeleted: { type: Boolean, default: false },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("blogpost", BlogPostsSchema);

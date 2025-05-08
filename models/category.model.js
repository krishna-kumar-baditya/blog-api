const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("category", CategorySchema);

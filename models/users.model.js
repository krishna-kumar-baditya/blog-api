const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        otp : {type : String ,default : null},
        profilePic: {type: String,required: true},
        isDeleted: { type: Boolean, default: false },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

UserSchema.methods.generateHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = async (password, checkPassword) => {
    return bcrypt.compareSync(password, checkPassword);
};

module.exports = mongoose.model("user", UserSchema);

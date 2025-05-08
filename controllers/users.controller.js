const User = require("../models/users.model");
const Mailer = require("../helper/mailer");
const jwt = require("jsonwebtoken");
// const deleteFile = require('../helper/deleteFile')
class UserController {
    async register(req, res) {
        try {
            if (!req.body.email) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Email is required",
                });
            }

            // Validate if fullName is provided
            if (!req.body.fullName) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Full name is required",
                });
            }

            // Validate if password is provided
            if (!req.body.password) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Password is required",
                });
            }
            const profilePic = req.file?.filename;
            if (!profilePic) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "profilePic is required",
                });
            }
            // Check if email already exists
            let isEmailExists = await User.find({
                email: req.body.email,
                isDeleted: false,
            });

            if (isEmailExists.length > 0) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Email is already taken",
                });
            }

            req.body.password = await new User().generateHash(
                req.body.password
            );
            let randomOtp = "";
            randomOtp += Math.floor(Math.random() * 9000)+1000;
            console.log("randomOtp ", randomOtp);

            req.body.otp = randomOtp;

            // Create new user record
            let saveUser = await User.create({...req.body,profilePic});

            if (saveUser) {
                const mailer = new Mailer(
                    "Gmail",
                    process.env.APP_EMAIL,
                    process.env.APP_PASSWORD
                );

                let mailObj = {
                    to: req.body.email,
                    subject: "Registration Confirmation",
                    text: `You have successfully register with us with ${req.body.email} email id and otp is ${req.body.password}. Thank You!!!`,
                };

                mailer.sendMail(mailObj);

                // Use find to query the saved user and exclude fields
                let userWithoutSensitiveData = await User.findById(
                    saveUser._id
                ).select("-password -_id -isDeleted -createdAt -updatedAt");

                return res.status(200).send({
                    status: 200,
                    data: userWithoutSensitiveData,
                    message: "Registration successfully completed!",
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Something went wrong during registration",
                });
            }
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: `internal server error ${error}`,
            });
        }
    }
    async verify(req, res) {
        try {
            let isEmail = await User.findOne({
                email: req.body.email,
                isDeleted: false,
            });
            let isOtp = await User.findOne({
                otp: req.body.otp,
            });
            if (isEmail && isOtp) {
                let data = await User.updateOne(
                    {
                        _id: isEmail._id,
                    },
                    {
                        $set: {
                            otp: null,
                        },
                    }
                );
                if (data) {
                    return res.status(200).send({
                        status: 200,
                        data: { data },
                        message: "Verify successfully completed!",
                    });
                } else {
                    return res.status(400).send({
                        status: 400,
                        data: {},
                        message: "Verify unsuccessfully !",
                    });
                }
            }
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: `internal server error ${error}`,
            });
        }
    }
    async signin(req,res) {
        try {
            // Validate if email is provided
            if (!req.body.email) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Email is required",
                });
            }
            // Validate if password is provided
            if (!req.body.password) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Password is required",
                });
            }

            req.body.email = req.body.email.trim().toLowerCase();
            let userData = await User.find({
                email: req.body.email,
                isDeleted: false,
            });
            if (userData.length > 0) {
                const isPasswordValid = await new User().validPassword(
                    req.body.password,
                    userData[0].password
                ); //1st param is for req.body.password and 2nd param is from userdetaisls

                if (isPasswordValid) {
                    let user = userData[0];

                    const payload = {
                        id: user._id,
                    };

                    let token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: "1D", // token expiration time
                    });

                    req.user = user;

                    // Use find to query the saved user and exclude fields
                    let userWithoutSensitiveData = await User.findById(
                        user._id
                    ).select("-password -_id -isDeleted -createdAt -updatedAt");

                    return res.status(200).send({
                        status: 200,
                        data: userWithoutSensitiveData,
                        token,
                        message: "Signin successfully completed!",
                    });
                } else {
                    return res.status(401).send({
                        status: 401,
                        data: {},
                        message:
                            "Authentication failed. You are not a valid user.",
                    });
                }
            } else {
                return res.status(401).send({
                    status: 401,
                    data: {},
                    message: "Authentication failed. You are not a valid user.",
                });
            }
        } catch (error) {
            return res.status(500).send({
                status: 500,
                data: {},
                message: err,
            });
        }
    }
    async userDetails(req,res){
        try {
          const{id}=req.params
          
          
          let user=await User.findOne({_id:id})
    
          if(user){
            return res.status(200).json({
              status:true,
              message:"User Details Fetched Successfully",
              user: {
                id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
              },
            })
          }
          
        } catch (err) {
          console.log("Server Error",err)
        }
      }
      async updateUser(req,res){
        try {
          const{id}=req.params;
          const{fullName,email}=req.body;
          const newProfilePic=req.file?.filename
        
          const existingUser=await User.findOne({_id:id})
        //   if(!existingUser.isVerified){
        //     return res.status(400).json({
        //       status:false,
        //       message:"User is not Verified"
        //     })
        //   }
    
          const updatedFeild={fullName,email}
    
          if(newProfilePic){
            if(existingUser.profilePic){
              deleteFile('uploads/profile',existingUser.profilePic)
            }
              updatedFeild.profilePic=newProfilePic
    
          }
          await User.updateOne({_id:id},updatedFeild)
          return res.status(200).json({
            message:"Updated SuccessFully",
            updatedFeild
          })
    
        } catch (error) {
          console.log("Something Went Worng",error)
        }
      }
    
}
module.exports = new UserController();

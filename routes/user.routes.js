const router = require("express").Router();
const UserController = require("../controllers/users.controller");
const profilerUploader = require("../helper/fileUpload");
const authCheck = require('../middleware/auth')()
const profileUpload = new profilerUploader({
  folderName: "uploads/profile",
  supportedFiles: ["image/jpeg", "image/png", "image/jpg"],
  fieldSize: 1024 * 1024 * 4,
});

router.post('/register',profileUpload.upload().single('profilePic'),UserController.register)
router.post('/verify',UserController.verify)
router.post('/signin',UserController.signin)
router.get('/details/:id',authCheck.authenticateAPI,UserController.userDetails)
router.post('/update/:id',authCheck.authenticateAPI, profileUpload.upload().single('profilePic'),UserController.updateUser)


module.exports = router;
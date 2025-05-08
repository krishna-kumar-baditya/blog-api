const router = require("express").Router();
const CategoryController = require("../controllers/category.controller");

const authCheck = require("../middleware/auth")();

router.post(
    "/create",
    authCheck.authenticateAPI,
    CategoryController.createCategory
);
router.get("/list", authCheck.authenticateAPI, CategoryController.categoryList);

module.exports = router;

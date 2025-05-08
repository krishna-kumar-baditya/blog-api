const router = require("express").Router();
const BlogPostsController = require("../controllers/blogpost.controller");

const authCheck = require("../middleware/auth")();

router.post(
    "/create",
    authCheck.authenticateAPI,
    BlogPostsController.createPost
);
router.post(
    "/update/:id",
    authCheck.authenticateAPI,
    BlogPostsController.updatePost
);
router.post(
    "/delete/:id",
    authCheck.authenticateAPI,
    BlogPostsController.deletePost
);
router.get(
    "/sorted-by-likes",
    authCheck.authenticateAPI,
    BlogPostsController.postsSortedByLikes
);

module.exports = router;

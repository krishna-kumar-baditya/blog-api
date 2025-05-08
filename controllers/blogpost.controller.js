const BlogPostModel = require("../models/blogpost.model");

class BlogPostsController {
    async createPost(req, res) {
        try {
            const { title, content, tags, likes, categoryId } = req.body;

            if (!title || !content || !tags || !categoryId) {
                return res.status(400).json({
                    status: 400,
                    message: "All feilds Required",
                });
            }
            console.log(title);
            console.log(content);
            console.log(tags);
            console.log(categoryId);
            console.log(req.user);

            const post = await BlogPostModel.create({
                title,
                content,
                tags,
                likes,
                categoryId,
                author: req.user._id,
            });
            console.log(post);

            if (post) {
                return res.status(201).json({
                    status: 201,
                    message: "Post Created Successfully",
                    post,
                });
            }
        } catch (error) {
            console.log("Something went Worng", error);
        }
    }

    async updatePost(req, res) {
        try {
            const { id } = req.params;
            const { title, content, tags, categoryId } = req.body;

            const existingPost = await BlogPostModel.findOne({ _id: id });

            if (!existingPost) {
                return res.status(400).json({
                    status: 400,
                    message: "Product not Found",
                });
            }
            let updatedProduct = {
                title,
                content,
                tags,
                categoryId,
            };

            const updateProduct = await BlogPostModel.updateOne(
                { _id: id },
                updatedProduct
            );
            if (updateProduct) {
                return res.status(200).json({
                    status: 200,
                    mesage: "Updated Successfully",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    async deletePost(req, res) {
        const Post = await BlogPostModel.findOne({ _id: req.params.id });
        if (Post.isDeleted) {
            return res.status(400).json({
                message: "Post Not Found",
            });
        }
        const deletePost = await BlogPostModel.updateOne(
            { _id: req.params.id },
            { isDeleted: true }
        );

        if (deletePost) {
            return res.status(200).json({
                status: 200,
                message: "Deleted Successfully",
            });
        }
    }
    async postsSortedByLikes(req, res) {
        try {
            const posts = await BlogPostModel.aggregate([
                {
                    $match: { isDeleted: false },
                },
                {
                    $lookup: {
                        from: "categories",
                        let: { categoryId: "$categoryId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$isDeleted", false] },

                                            { $eq: ["$_id", "$$categoryId"] },
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    title: 1,
                                    content: 1,
                                    tags: 1,
                                    likes: 1,
                                },
                            },
                        ],
                        as: "category",
                    },
                },
                {
                    $sort: { likes: 1 },
                },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        tags: 1,
                        likes: 1,
                    },
                },
            ]);

            return res.status(200).json({
                status: 200,
                message: "Blog posts sorted by likes",
                posts,
            });
        } catch (error) {
            console.error("Error retrieving sorted posts (pipeline):", error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    }
}

module.exports = new BlogPostsController();

const CategoryModel = require("../models/category.model");

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name ,description} = req.body;

      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Name is Required",
        });
      }
      if (!description) {
        return res.status(400).json({
          status: false,
          message: "Description is Required",
        });
      }
      const isNameExist = await CategoryModel.findOne({ name });

      if (isNameExist) {
        return res.status(400).json({
          status: false,
          message: "Name Already Exist",
        });
      }

      const category = await CategoryModel.create({ name,description });
      if (category) {
        return res.status(201).json({
          status: false,
          message: "Category Created Successfully",
          category,
        });
      }
    } catch (e) {
      console.log("Server Error", e);
    }
  }

  async categoryList(req, res) {
    try {
      const category = await CategoryModel.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $lookup: {
            from: "blogposts",
            let: { categoryId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$isDeleted", false] },
                      { $eq: ["$categoryId", "$$categoryId"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  title: 1,
                  content: 1,
                  tags: 1,
                },
              },
            ],

            as: "postDetails",
          },
        },
        {
          $project: {
            categoryName: "$name",
            totalPost: {
              $size: "$postDetails",
            },
            postData: "$postDetails",
          },
        },
      ]);

      if (category) {
        return res.status(200).json({
          category,
        });
      }
    } catch (error) {
      console.log("Something Went Worng", error);
    }
  }
}

module.exports = new CategoryController();
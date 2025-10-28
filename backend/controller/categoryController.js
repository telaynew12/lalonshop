const Category = require("../model/categoryModel");
const fs = require("fs");
const path = require("path");
const genUniqFileName = require("../utilities/genUniqFileName");
const subCategoryModel = require("../model/subCategoryModel");
const subSubCategoryModel = require("../model/subSubCategoryModel");

const categoryGetAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const image = req.files.image;
  const { name } = JSON.parse(req.body.data);
  try {
    const mediaDir = path.join(__dirname, "../media");
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir);
    }
    const fileNewName = await genUniqFileName(image.name);
    const filePath = await path.join(mediaDir, fileNewName);
    const category = new Category({
      name,
      avatar: fileNewName,
    });
    await category.save();
    await image.mv(filePath);
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await Category.findByIdAndDelete(categoryId);
    const mediaDir = path.join(__dirname, "../media");
    const filePath = path.join(mediaDir, category.avatar);
    if (fs.existsSync(filePath)) {
      await fs.unlinkSync(filePath);
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllCategorySubCategory = async (req, res) => {
  try {
    const category = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$category", "$$categoryId"],
                },
              },
            },
            {
              $lookup: {
                from: "subsubcategories",
                localField: "_id",
                foreignField: "subCategory",
                as: "subSubCategory",
              },
            },
          ],
          as: "subCategory",
        },
      },
      {
        $addFields: {
          subCategorySize: { $size: "$subCategory" },
        },
      },
      {
        $sort: { subCategorySize: -1 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          subCategory: {
            _id: 1,
            name: 1,
            avatar: 1,
            subSubCategory: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        },
      },
      {
        $project: {
          subCategorySize: 0,
        },
      },
    ]);

    res.status(200).json({ category: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const categories = [
  {
    category: "Sarisha Oil",
    subcategories: [
      { name: "Organic Sarisha Oil" },
      { name: "Refined Sarisha Oil" },
      { name: "Cold-Pressed Sarisha Oil" },
    ],
  },
  {
    category: "Ghee (ঘি)",
    subcategories: [
      {
        name: "Cow Ghee",
        subSubcategories: [
          { name: "Grass-Fed Cow Ghee" },
          { name: "A2 Cow Ghee" },
          { name: "Desi Ghee" },
        ],
      },
      { name: "Buffalo Ghee" },
      { name: "Organic Ghee" },
    ],
  },
  {
    category: "Dates (খেজুর)",
    subcategories: [
      { name: "Ajwa Dates" },
      { name: "Medjool Dates" },
      { name: "Sukari Dates" },
    ],
  },
  {
    category: "Honey",
    subcategories: [
      {
        name: "Raw Honey",
        subSubcategories: [
          { name: "Acacia Honey" },
          { name: "Wildflower Honey" },
          { name: "Manuka Honey" },
        ],
      },
      { name: "Organic Honey" },
      { name: "Flavored Honey" },
    ],
  },
  {
    category: "Masala",
    subcategories: [
      { name: "Whole Spices" },
      {
        name: "Ground Spices",
        subSubcategories: [
          { name: "Turmeric Powder" },
          { name: "Chili Powder" },
          { name: "Cumin Powder" },
        ],
      },
      { name: "Spice Blends" },
    ],
  },
  {
    category: "Organic Oil",
    subcategories: [
      { name: "Coconut Oil" },
      { name: "Olive Oil" },
      { name: "Mustard Oil" },
    ],
  },
  {
    category: "Nuts & Seeds",
    subcategories: [
      { name: "Almonds" },
      { name: "Cashews" },
      { name: "Sunflower Seeds" },
    ],
  },
  {
    category: "Tea/Coffee",
    subcategories: [
      { name: "Herbal Tea" },
      { name: "Black Tea" },
      {
        name: "Specialty Coffee",
        subSubcategories: [
          { name: "Arabica Coffee" },
          { name: "Robusta Coffee" },
          { name: "Blended Coffee" },
        ],
      },
    ],
  },
  {
    category: "Functional Food",
    subcategories: [
      {
        name: "Superfoods",
        subSubcategories: [
          { name: "Chia Seeds" },
          { name: "Spirulina" },
          { name: "Flax Seeds" },
        ],
      },
      { name: "Protein Powders" },
      { name: "Probiotics" },
    ],
  },
  {
    category: "খেজুর গুড় (Date Palm Jaggery)",
    subcategories: [
      {
        name: "Liquid Jaggery",
        subSubcategories: [
          { name: "Organic Liquid Jaggery" },
          { name: "Spiced Liquid Jaggery" },
        ],
      },
      { name: "Solid Jaggery" },
      { name: "Powdered Jaggery" },
    ],
  },
];

// insert categories, subcategories, and subsubcategories

// const insertCategories = async () => {
//   try {
//     await Promise.all(
//       categories.map(async (category) => {
//         const newCategory = await new Category({
//           name: category.category,
//         }).save();

//         if (category.subcategories) {
//             await Promise.all(
//                 category.subcategories.map(async (subCategory) => {
//                 const newSubCategory = await new subCategoryModel({
//                     name: subCategory.name,
//                     category: newCategory._id,
//                 }).save();
    
//                 if (subCategory.subSubcategories) {
//                     await Promise.all(
//                     subCategory.subSubcategories.map(async (subSubCategory) => {
//                         await new subSubCategoryModel({
//                         name: subSubCategory.name,
//                         subCategory: newSubCategory._id,
//                         }).save();
//                     })
//                     );
//                 }
//                 })
//             );
//         }


//         return category;
//       })
//     );

//     console.log("Categories inserted successfully");
//   } catch (error) {
//     console.log(error);
//   }
// };

// insertCategories();

module.exports = {
  categoryGetAdmin,
  createCategory,
  deleteCategory,
  getAllCategorySubCategory,
};

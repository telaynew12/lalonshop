const Product = require("../model/productModel");
const genUniqFileName = require("../utilities/genUniqFileName");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const Review = require("../model/reviewModel");
const SearchKey = require("../model/searchKeyModel");
const FavProduct = require("../model/favProductModel");
const { Parser } = require("json2csv");
const nameToId = require("../utilities/nameToId");

const searchProducts = async (req, res) => {
  try {
    const {
      take = 10,
      search,
      category,
      sub,
      subsub,
      page = 1,
    } = await req.query;
    let query = [];
    if (search) {
      query.push({ title: { $regex: search, $options: "i" } });
      query.push({ tags: { $regex: search, $options: "i" } });
      query.push({ brand: { $regex: search, $options: "i" } });
      const searchKey = await SearchKey.findOne({ name: search });
      if (searchKey) {
        searchKey.count = searchKey.count + 1;
        await searchKey.save();
      } else {
        await new SearchKey({ name: search, count: 1 }).save();
      }
    }
    if (category) {
      query.push({ category: new mongoose.Types.ObjectId(category) });
    }
    if (sub) {
      query.push({ subCategory: new mongoose.Types.ObjectId(sub) });
    }
    if (subsub) {
      query.push({ subSubCategory: new mongoose.Types.ObjectId(subsub) });
    }
    if (query.length === 0) {
      query.push({});
    }
    const products = await Product.aggregate([
      {
        $match: {
          $and: [
            { status: "active" },
            {
              $or: query,
            },
          ],
        },
      },
      {
        $facet: {
          data: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $skip: +take * (+page - 1),
            },
            {
              $limit: +take,
            },
            {
              $sample: { size: +take },
            },
            {
              $unwind: {
                path: "$media",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id",
                id: { $first: "$id" },
                title: { $first: "$title" },
                price: { $first: "$price" },
                discount: { $first: "$discount" },
                media: { $first: "$media" },
                tags: { $first: "$tags" },
              },
            },
            {
              $project: {
                _id: 1,
                id: 1,
                title: 1,
                price: 1,
                discount: 1,
                media: {
                  name: 1,
                },
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          data: 1,
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
        },
      },
    ]);
    res.json({
      products: products[0]?.data,
      totalCount: products[0]?.totalCount || 0,
      totalPage: Math.ceil((products[0]?.totalCount || 0) / +take),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
};

const productInDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req?.user?.id;
    const product = await Product.findOne({
      $or: [
        {
          _id: id,
        },
        {
          id: id,
        },
      ],
    })
      .populate([
        {
          path: "category",
        },
        {
          path: "subCategory",
          select: "-category",
        },
        {
          path: "subSubCategory",
          select: "-category -subCategory",
        },
      ])
      .select("-createdAt -updatedAt -__v -click");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const reviews = await Review.find({ product: id })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar -_id")
      .limit(5);
    const totalReview = await Review.find({ product: id }).countDocuments();
    const fav = await FavProduct.findOne({ user: userId || null, product: id });

    res.json({
      ...product.toObject(),
      reviews,
      totalReview,
      favorite: fav ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const file = await req.files?.media;
    const {
      shop,
      size,
      color,
      material,
      variant,
      height,
      width,
      price,
      discount,
      subCategory,
      subSubCategory,
      ...otherData
    } = await JSON.parse(req.body.data);
    const productImg = Array.isArray(file) ? file : [file];
    const fileUniqName = await Promise.all(
      productImg.map(async (img) => {
        img.name = await genUniqFileName(img.name);
        return img;
      })
    );

    const fileNameType = await Promise.all(
      fileUniqName.map((img) => {
        return { name: img.name, type: img.mimetype };
      })
    );

    let extraData = {};
    if (subCategory) {
      extraData["subCategory"] = subCategory;
    }
    if (subSubCategory) {
      extraData["subSubCategory"] = subSubCategory;
    }
    if (shop) {
      extraData["shop"] = shop;
    }

    const product = await new Product({
      ...otherData,
      ...extraData,
      price: +price,
      id: await nameToId(otherData.title),
      discount: +discount || 0,
      media: fileNameType,
      attributes: {
        size: size || [],
        color: color || [],
        material: material || [],
        variant: variant || [],
        height: height || [],
        width: width || [],
      },
    });
    const mediaPath = path.join(__dirname, "../media");
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath);
    }
    await Promise.all(
      fileUniqName.map(async (img) => {
        const imagePath = path.join(mediaPath, img.name);
        await img.mv(imagePath);
      })
    );
    const savedProduct = await product.save();
    res.json({ message: "Product created successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const file = await req?.files?.media;

    const { id } = await req.params;
    const {
      shop,
      size,
      color,
      material,
      variant,
      height,
      width,
      price,
      discount,
      subCategory,
      subSubCategory,
      costing,
      ...otherData
    } = await JSON.parse(req.body.data);
    const productImg = await file ? (Array.isArray(file) ? file : [file]) : [];
   

    const fileUniqName = await Promise.all(
      productImg.map(async (img) => {
        img.name = await genUniqFileName(img.name);
        return img;
      })
    );

    const fileNameType = await Promise.all(
      fileUniqName.map((img) => {
        return { name: img.name, type: img.mimetype };
      })
    );

     const mediaPath = path.join(__dirname, "../media");
    if (!fs.existsSync(mediaPath)) {
      fs.mkdirSync(mediaPath);
    }
    await Promise.all(
      fileUniqName.map(async (img) => {
        const imagePath = path.join(mediaPath, img.name);
        await img.mv(imagePath);
      })
    );


    console.log(costing);

    let extraData = {};
    if (subCategory) {
      extraData["subCategory"] = subCategory;
    }
    if (subSubCategory) {
      extraData["subSubCategory"] = subSubCategory;
    }
    if (shop) {
      extraData["shop"] = shop;
    }

    await Product.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...otherData,
          ...extraData,
          price: +price,
          discount: +discount || 0,
          costing: +costing,
          attributes: {
            size: size || [],
            color: color || [],
            material: material || [],
            variant: variant || [],
            height: height || [],
            width: width || [],
          },
        },
        $push: {
          media: { $each: fileNameType },
        },
      }
    );

    res.json({ message: "Product updated successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const inTotalProduct = async (req, res) => {
  const activeQuery = { status: { $in: ["active", "inactive"] } };
  const pendingQuery = { status: "pending" };
  const rejectedQuery = { status: { $in: ["suspended", "rejected"] } };
  try {
    const approvedProduct = await Product.find(activeQuery).countDocuments();
    const pendingProduct = await Product.find(pendingQuery).countDocuments();
    const rejectedProduct = await Product.find(rejectedQuery).countDocuments();

    res.json({ approvedProduct, pendingProduct, rejectedProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPendingProduct = async (req, res) => {
  try {
    const { skip } = await req.query;
    const pendingProduct = await Product.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .skip(skip ? +skip : 0)
      .limit(10);
    res.json(pendingProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getApprovedProduct = async (req, res) => {
  try {
    const { skip } = await req.query;
    const approvedProduct = await Product.find({
      status: { $in: ["active", "inactive"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip ? +skip : 0)
      .limit(10);
    res.json(approvedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRejectedProduct = async (req, res) => {
  try {
    const { skip } = await req.query;
    const rejectedProduct = await Product.find({
      status: { $in: ["suspended", "rejected"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip ? +skip : 0)
      .limit(10);
    res.json(rejectedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveProduct = async (req, res) => {
  try {
    const { id } = await req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "active";
    await product.save();
    res.json({ message: "Product approved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "rejected";
    await product.save();
    res.json({ message: "Product rejected successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const suspendProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "suspended";
    await product.save();
    res.json({ message: "Product suspended successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const active = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "active";
    await product.save();
    res.json({ message: "Product activated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const inactive = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = "inactive";
    await product.save();
    res.json({ message: "Product inactivated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRandomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          title: 1,
          price: 1,
          discount: 1,
          media: { $arrayElemAt: ["$media", 0] },
        },
      },
    ]);
    res.json({ products: products });
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
};

const fetchProductData = async () => {
  const products = await Product.find({ status: "active" });
  const allProduct = await Promise.all(
    products.map(async (product) => {
      return {
        id: product._id,
        title: product.title,
        description: product.description,
        availability: "in stock",
        condition: "new",
        price: `${product.price - product.discount} BDT`,
        link: `${process.env.WEB_URL}/product/${product._id}`,
        image_link: `${process.env.BACKEND_URL}/api/v1/media?name=${product.media[0].name}`,
      };
    })
  );

  return allProduct;
};

const getAllProductName = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" }).select(
      "title _id"
    );
    await res.json(products);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const productFeed = async (req, res) => {
  try {
    const products = await fetchProductData();
    const fields = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment("product_feed.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const relatedProduct = async (req, res) => {
  try {
    const { product } = await req.query;
    const findProduct = await Product.findById(product).select("category _id");
    let products;
    products = await Product.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(findProduct?.category),
          _id: { $ne: new mongoose.Types.ObjectId(product) },
        },
      },
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          title: 1,
          price: 1,
          discount: 1,
          media: { $arrayElemAt: ["$media", 0] },
        },
      },
    ]);
    if (products.length < 10) {
      const productId = products.map((product) => product._id);
      const reFindProduct = await Product.aggregate([
        {
          $match: {
            _id: { $nin: [...productId, findProduct?._id] },
          },
        },
        {
          $sample: { size: 10 - products?.length },
        },
        {
          $project: {
            title: 1,
            price: 1,
            discount: 1,
            media: { $arrayElemAt: ["$media", 0] },
          },
        },
      ]);
      products = await [...products, ...reFindProduct];
    }
    res.json({
      success: true,
      products: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = await req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const imageIndex = product.media.findIndex(
      (img) => img._id.toString() === imageId
    );
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }
    product.media.splice(imageIndex, 1);
    await product.save();
    res.json({
      message: "Image deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProduct,
  inTotalProduct,
  getPendingProduct,
  getApprovedProduct,
  getRejectedProduct,
  approveProduct,
  rejectProduct,
  suspendProduct,
  active,
  inactive,
  searchProducts,
  productInDetail,
  getRandomProducts,
  updateProduct,
  deleteProduct,
  getAllProductName,
  productFeed,
  relatedProduct,
  deleteProductImage,
};

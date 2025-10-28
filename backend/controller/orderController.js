const { default: axios } = require("axios");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const courierModel = require("../model/courierModel");
const cron = require("node-cron");
const formatDate = require("../utilities/getFormatDate");

const createOrder = async (req, res) => {
  try {
    const data = await req.body;
    const product = await Product.findById(data.product).select(
      "price title discount _id"
    );
    const discountPrice = (await product.price) - product.discount;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const totalOrder = await Order.countDocuments();
    const total = discountPrice * data.quantity + data.deliveryCharge;
    const order = new Order({
      orderProduct: [
        {
          product: product._id,
          quantity: data.quantity,
          color: data.color || "N/A",
          size: data.size || "N/A",
          height: data.height || "N/A",
          width: data.width || "N/A",
          material: data.material || "N/A",
          variant: data.variant || "N/A",
        },
      ],
      name: data.name,
      phone: data.phone,
      address: data.address,
      quantity: data.quantity,
      district: data.district,
      subDistrict: data.subDistrict, // Upazila
      deliveryCharge: data.deliveryCharge,
      email: data?.email || "",
      total: total,
    });
    await order.save();
    await res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createMultipleOrder = async (req, res) => {
  try {
    const data = await req.body;
    console.log(data);
    let products = [];
    let total = 0;
    quantity = 0;

    await Promise.all(
      Object.keys(data?.products).map(async (key) => {
        const productId = await data.products[key].product;
        const product = await Product.findById(productId).select(
          "price title discount _id"
        );
        const discountPrice = (await product.price) - product.discount;
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        quantity += data.products[key].quantity;
        total += await (discountPrice * data.products[key].quantity);
        await products.push(data.products[key]);
        return products;
      })
    );

    total += data.deliveryCharge;

    const order = await new Order({
      orderProduct: products,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address,
      quantity: quantity,
      district: data.district,
      subDistrict: data.subDistrict, // Upazila
      deliveryCharge: data.deliveryCharge,
      total: total,
    }).save();

    await res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createSteedFastOrder = async (
  { _id, name, phone, address, subDistrict, district, total },
  note
) => {
  try {
    const body = await {
      invoice: _id,
      recipient_name: name,
      recipient_phone: phone,
      recipient_address: `${address}, ${subDistrict}, ${district}`,
      cod_amount: total,
      note: note || "",
    };
    const steedFastApiKey = await process.env.STEED_FAST_API?.toString().trim();
    const steedFastSecret = process.env.STEED_FAST_SECRET?.toString().trim();
    const headers = await {
      "Content-Type": "application/json",
      "Api-Key": steedFastApiKey,
      "Secret-Key": steedFastSecret,
    };
    const response = await axios.post(
      `${process.env.STEED_FAST_URL}/create_order`,
      body,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating SteedFast order:", error);
    return new Error(error);
  }
};

const acceptOrder = async (req, res) => {
  try {
    let consignment_id = "";
    let tracking_id = "";
    const { orderId, note = "" } = await req.body;
    const order = await Order.findById(orderId).populate(
      "orderProduct.product",
      "title price discount"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (process.env.STEED_FAST_API && process.env.STEED_FAST_SECRET) {
      const steedFast = await createSteedFastOrder(order, note);
      consignment_id = steedFast.consignment.consignment_id;
      tracking_id = steedFast.consignment.tracking_code;
    }
    await Order.findByIdAndUpdate(orderId, {
      status: "accepted",
      consignment_id: consignment_id,
      tracking_id: tracking_id,
    });
    await res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { status, phone, skip } = await req.query;
    let quary = {};
    if (status) {
      quary["status"] = status;
    }
    if (phone) {
      quary["phone"] = { $regex: phone, $options: "i" };
    }
    // const orders = await Order.find(quary).populate("orderProduct.product", 'title price discount').sort('-updatedAt');
    const orders = await Order.aggregate([
      {
        $match: quary,
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip ? parseInt(skip) : 0 },
      { $limit: 10 },
      {
        $unwind: "$orderProduct",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderProduct.product",
          foreignField: "_id",
          as: "orderProduct.product",
        },
      },
      {
        $unwind: "$orderProduct.product",
      },
      {
        $addFields: {
          "orderProduct.product.media": {
            $arrayElemAt: ["$orderProduct.product.media", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          orderProduct: { $push: "$orderProduct" },
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          district: { $first: "$district" },
          subDistrict: { $first: "$subDistrict" },
          deliveryCharge: { $first: "$deliveryCharge" },
          total: { $first: "$total" },
          status: { $first: "$status" },
          consignment_id: { $first: "$consignment_id" },
          tracking_id: { $first: "$tracking_id" },
          updatedAt: { $first: "$updatedAt" },
          createdAt: { $first: "$createdAt" },
          email: { $first: "$email" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    await res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// 'pending', 'accepted', 'shipped', 'delivered', 'canceled', 'returned'
const statusTitle = {
  pending: "Order Placed",
  accepted: "Order Accepted",
  shipped: "Order Shipped",
  delivered: "Order Delivered",
  canceled: "Order Canceled",
  returned: "Order Returned",
};

const changeOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = await req.body;
    console.log(orderId, status);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Order.findByIdAndUpdate(orderId, {
      status: status,
    });
    await res
      .status(200)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const editOrder = async (req, res) => {
  try {
    const { orderId, data } = await req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const update = await Order.findByIdAndUpdate(orderId, data, {
      new: true,
    });
    await res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getProfitSummery = async (req, res) => {
  try {
    const { from, to } = await req.query;
    const startDate = new Date(`${from}T00:00:00.000Z`);
    const endDate = new Date(`${to}T23:59:59.999Z`);

    console.log(startDate, endDate);

    const deliveredOrder = await Order.aggregate([
      {
        $match: {
          $and: [
            { status: "delivered" },
            {
              updatedAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          ],
        },
      },
      {
        $unwind: "$orderProduct",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderProduct.product",
          foreignField: "_id",
          as: "orderProduct.product",
        },
      },
      {
        $addFields: {
          "orderProduct.product": {
            $arrayElemAt: ["$orderProduct.product", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          orderProduct: {
            $push: {
              product: "$orderProduct.product",
              quantity: "$orderProduct.quantity",
            },
          },
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          district: { $first: "$district" },
          subDistrict: { $first: "$subDistrict" },
          deliveryCharge: { $first: "$deliveryCharge" },
          total: { $first: "$total" },
        },
      },
      {
        $addFields: {
          totalCosting: {
            $sum: {
              $map: {
                input: "$orderProduct",
                as: "order",
                in: {
                  $multiply: ["$$order.product.costing", "$$order.quantity"],
                },
              },
            },
          },
          sellingPrice: {
            $subtract: ["$total", "$deliveryCharge"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalCosting: 1,
          sellingPrice: 1,
        },
      },
    ]);

    const returnDeliveryCharge = await Order.find({
      $and: [
        { status: "returned" },
        {
          updatedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ],
    }).select("deliveryCharge -_id");

    const totalCosting = await deliveredOrder.reduce(
      (acc, curr) => acc + curr.totalCosting,
      0
    );
    const totalSellingPrice = await deliveredOrder.reduce(
      (acc, curr) => acc + curr.sellingPrice,
      0
    );
    const totalReturnDeliveryCharge = await returnDeliveryCharge.reduce(
      (acc, curr) => acc + curr.deliveryCharge,
      0
    );
    const totalProfit =
      totalSellingPrice - totalCosting - totalReturnDeliveryCharge;

    await res.status(200).json({
      totalCosting,
      totalSellingPrice,
      totalProfit,
      totalDelivered: deliveredOrder.length,
      totalReturned: returnDeliveryCharge.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDashboardSummery = async (req, res) => {
  try {
    const totalOrder = await Order.countDocuments();
    const totalDelivered = await Order.countDocuments({ status: "delivered" });
    const totalReturned = await Order.countDocuments({ status: "returned" });
    const totalPendingOrder = await Order.countDocuments({ status: "pending" });
    const totalProducts = await Product.countDocuments();
    const totalShippedOrder = await Order.countDocuments({ status: "shipped" });
    const totalAcceptedOrder = await Order.countDocuments({ status: "accepted" });

    const deliveredOrder = await Order.aggregate([
      {
        $match: {
          $and: [
            { status: "delivered" },
          ],
        },
      },
      {
        $unwind: "$orderProduct",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderProduct.product",
          foreignField: "_id",
          as: "orderProduct.product",
        },
      },
      {
        $addFields: {
          "orderProduct.product": {
            $arrayElemAt: ["$orderProduct.product", 0],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          orderProduct: {
            $push: {
              product: "$orderProduct.product",
              quantity: "$orderProduct.quantity",
            },
          },
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          address: { $first: "$address" },
          district: { $first: "$district" },
          subDistrict: { $first: "$subDistrict" },
          deliveryCharge: { $first: "$deliveryCharge" },
          total: { $first: "$total" },
        },
      },
      {
        $addFields: {
          totalCosting: {
            $sum: {
              $map: {
                input: "$orderProduct",
                as: "order",
                in: {
                  $multiply: ["$$order.product.costing", "$$order.quantity"],
                },
              },
            },
          },
          sellingPrice: {
            $subtract: ["$total", "$deliveryCharge"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalCosting: 1,
          sellingPrice: 1,
        },
      },
    ]);

    const returnDeliveryCharge = await Order.find({
      $and: [
        { status: "returned" },
      ],
    }).select("deliveryCharge -_id");

    const totalCosting = await deliveredOrder.reduce(
      (acc, curr) => acc + curr.totalCosting,
      0
    );
    const totalSellingPrice = await deliveredOrder.reduce(
      (acc, curr) => acc + curr.sellingPrice,
      0
    );
    const totalReturnDeliveryCharge = await returnDeliveryCharge.reduce(
      (acc, curr) => acc + curr.deliveryCharge,
      0
    );
    const totalProfit =
      totalSellingPrice - totalCosting - totalReturnDeliveryCharge;

    await res.status(200).json({
      totalOrder,
      totalDelivered,
      totalReturned,
      totalPendingOrder,
      totalProducts,
      totalProfit,
      totalShippedOrder,
      totalAcceptedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  acceptOrder,
  getOrder,
  changeOrderStatus,
  editOrder,
  getProfitSummery,
  createMultipleOrder,
  getDashboardSummery
};

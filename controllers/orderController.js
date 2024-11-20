const Order = require("../models/Order");
const mongoose = require ("mongoose")

const createOrder = async (req, res) => {
  try {
    const body = new Order(req.body);
    await body.save();

    res.status(201).json(body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$product",
      },
      {
        $project: { "user.password": 0, product_id: 0, user_id: 0 },
      },
    ]);

    // const orders = await Order.find().populate("user_id")

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = new mongoose.Types.ObjectId(req.params.id);
    const order = await Order.aggregate([
      { $match: { _id: orderId } },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$product",
      },
      {
        $project: { "user.password": 0, product_id: 0, user_id: 0 },
      },
    ]);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteOrder = async (req, res) => {
  try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) { 
          return res.status(404).json({ error: 'order not found' });
      }
      res.status(200).json({ message: 'order deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  deleteOrder
};

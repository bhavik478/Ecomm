const express = require("express")
const router = express.Router();
const {getOrders, createOrder, getOrderById, deleteOrder} = require("../controllers/orderController")


router.get("/orders", getOrders)
router.post("/orders", createOrder)
router.get("/orders/:id", getOrderById)
router.delete("/orders/:id", deleteOrder)





module.exports = router
const express = require("express");
const { createProduct, getAllProducts, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const router = express.Router();
const {protect, restrict} = require("../middleware/authMiddleware")


router.post("/product", createProduct)
router.get("/product", getAllProducts)
router.put("/product/:id", updateProduct)
router.get("/product/:id", getSingleProduct)
router.delete("/product/:id",protect,restrict("admin"), deleteProduct)





module.exports = router
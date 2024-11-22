const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controllers/productController");
const router = express.Router();
const { protect, restrict } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

router.post("/product", upload.single("productImage"), createProduct);
router.get("/product", getAllProducts);
router.put("/product/:id", upload.single("productImage"), updateProduct);
router.get("/product/:id", getSingleProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;

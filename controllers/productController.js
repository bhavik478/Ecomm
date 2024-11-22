const Product = require("../models/Product");
const Category = require("../models/category");

// Create a new product using category ID
const createProduct = async (req, res) => {
  console.log(req.file, "file");
  try {
    const { categoryId, ...productData } = req.body;

    // Validate category existence
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Add the category ID to the product
    const body = new Product({ ...productData, category: categoryId });

    // If an image is uploaded, include the image path
    if (req.file) {
      body.productImage = req.file.path;
    }

    await body.save();

    res
      .status(201)
      .json({ data: body, message: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products or filter by category ID
const getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const query = categoryId ? { category: categoryId } : {};
    const products = await Product.find(query).populate(
      "category",
      "name description"
    );

    res
      .status(200)
      .json({ data: products, message: "Product get successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res
      .status(200)
      .json({ data: product, message: "Product get successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID, including updating its category
const updateProduct = async (req, res) => {
  try {
    const { categoryId, ...updatedData } = req.body;

    // Validate the category if categoryId is provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      updatedData.category = categoryId;
    }

    // If an image is uploaded, update the image path
    // if (req.file) {
    //   updatedData.productImage = req.file.path;
    // }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({ data: product, message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

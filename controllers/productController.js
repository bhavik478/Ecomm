const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const Category = require("../models/category");
const fs = require("fs"); // To manage temporary files

// Create a new product using category ID
const createProduct = async (req, res) => {
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

    const body = new Product({ ...productData, category: categoryId });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      body.productImage = result.secure_url;
      fs.unlinkSync(req.file.path);
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

    res.status(200).json({
      data: products,
      message: "Product get successfully",
      totalProducts: products.length,
    });
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

    // Find the product to update
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If a new file is uploaded, upload it to Cloudinary
    if (req.file) {
      // Delete the old image from Cloudinary if it exists
      if (product.productImage) {
        const publicId = product.productImage.split("/").pop().split(".")[0]; // Extract public_id from the URL
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      updatedData.productImage = result.secure_url;

      // Delete the temporary file
      fs.unlinkSync(req.file.path);
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    // Delete the old image from Cloudinary if it exists
    if (product.productImage) {
      const publicId = product.productImage.split("/").pop().split(".")[0]; // Extract public_id from the URL
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }
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

const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

//using mongodb
router.post("/users", upload.single("profileImage"), createUser);

// Update a user with image upload
router.put("/users/:id", upload.single("profileImage"), updateUser);
// router.post('/users', createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
// router.put('/users/:id', updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;

const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const CustomError = require('../utils/CustomError');


const asyncErrorHandler = (func) => {
    func(req, res, next)
}
  

const createUser = async (req, res, next) => {
    try {
        const user = new User(req.body);
        if (req?.file) {
            user.image = req?.file?.path;
        }
        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        const err = new CustomError(error.message, 400)

        next(err);
        // res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page, limit, search = '' } = req.query;

        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        let users;
        let count;
        const totalUsers = await User.countDocuments();

        if (page && limit) {
            const parsedPage = parseInt(page);
            const parsedLimit = parseInt(limit);

            users = await User.find(query)
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .skip((parsedPage - 1) * parsedLimit)
                .limit(parsedLimit)
                .exec();

            count = await User.countDocuments(query);
            res.status(200).json({
                users,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                totalUsers
            });
        } else {
            users = await User.find(query)
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .exec();
            count = users.length;

            res.status(200).json({
                users,
                totalUsers
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        const err = new CustomError(error.message, 500)

        next(err);
        // res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.image = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) { 
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};

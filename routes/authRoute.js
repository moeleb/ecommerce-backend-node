const express = require("express");
const {createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser,blockUser, unBlockUser, handleRefreshToken, logout, updatePassword} = require("../controllers/userController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUsers);
router.get('/refresh',handleRefreshToken);
router.put('/password',authMiddleware, updatePassword);
router.get('/logout',logout);
router.get('/:id',authMiddleware,isAdmin, getUser);
router.put('/:id',authMiddleware, updateUser);
router.delete('/:id', deleteUser);
router.put('/block-user/:id',authMiddleware, isAdmin,blockUser );
router.put('/unblock-user/:id',authMiddleware,isAdmin,unBlockUser);











module.exports = router ;
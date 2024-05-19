const { createProduct, getProduct, getProducts, deleteProduct, updateProduct, addToWishlist ,rating} = require("../controllers/productController");
const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router = express.Router()

router.post('/add',authMiddleware,isAdmin, createProduct);
router.get('/all', getProducts);
router.get('/:id', getProduct);
router.put('/:id',authMiddleware,isAdmin, updateProduct);
router.put('/product',authMiddleware, addToWishlist);
router.put('/rating',authMiddleware, rating);
router.delete(':/id',authMiddleware, isAdmin  ,deleteProduct )
router.post('/upload', authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize)
module.exports = router ;
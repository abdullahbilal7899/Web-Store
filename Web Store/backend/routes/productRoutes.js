import express from "express";
import formidable from "express-formidable";
import { authenticate,authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from '../middlewares/checkId.js'
import { addProduct, addProductReview, fetchAllProducts, fetchNewProducts, fetchProductById, fetchProducts, fetchTopProducts, filerProducts, removeProduct, updateProductDetails } from "../controllers/productController.js";



const router=express.Router()


router.route('/')
.get(fetchProducts)
.post(authenticate,authorizeAdmin,formidable(),addProduct)

router.route('/allproducts').get(fetchAllProducts)

router.get('/top',fetchTopProducts)
router.get('/new',fetchNewProducts)


router.route('/:id/reviews').post(authenticate,checkId,addProductReview)

router.route('/:id')
.get(fetchProductById)
.put(authenticate,authorizeAdmin,formidable(),updateProductDetails)
.delete(authenticate,authorizeAdmin,removeProduct)

router.route('/filtered-products').post(filerProducts)

export default router

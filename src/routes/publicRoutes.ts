import express = require('express')

//Middleware
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'
import validationMiddleware from '../middlewares/validation.md'
import FrontendAuthenticationMd from '../middlewares/FrontendAuthentication.md'
import frontValidationMiddleware from '../middlewares/frontValidation.md'

// DTO
import SignUpDto from '../dto/frontend/signup.dto'
import SignInDto from '../dto/frontend/signIn.dto'
import UserEditDto from '../dto/frontend/userEdit.dto'
import checkoutDto from '../dto/frontend/checkout.dto'

//Controller
import homeController from '../controllers/frontend/frontend_home'
import productController from '../controllers/frontend/frontend_product'
import cartController from '../controllers/frontend/frontend_cart'
import authController from '../controllers/frontend/frontend_auth'
import userController from '../controllers/frontend/frontend_user'
import checkoutController from '../controllers/frontend/frontend_checkout'

import {Request , Response} from 'express'
import SearchDTO from '../dto/frontend/search.dto'

const Router = express.Router()

Router.use(frontLocalVariableMd)

/**
 * HomePage
 */
Router.get('/' , homeController.getHome)

/**
 * Product
 */
Router.get('/products' , productController.getProducts)
Router.get('/products-instrument/:instrument' , productController.getProductsIns)
Router.get('/products-category/:category' , productController.getProductsCat)
Router.get('/product/:id' , productController.getProduct)
Router.all("/search" ,  productController.postSearch)


/**
 * Cart
 */
Router.get('/cart' , FrontendAuthenticationMd ,  cartController.getCart)

/**
 * Checkout
 */
Router.get('/checkout' , FrontendAuthenticationMd , checkoutController.getCheckout)
Router.post('/checkout' , FrontendAuthenticationMd , frontValidationMiddleware(checkoutDto , '/checkout') , checkoutController.postCheckout)
Router.get('/checkout_callback' , FrontendAuthenticationMd , checkoutController.getCallback)

/**
 * Auth
 */
Router.post("/user/register" , frontValidationMiddleware(SignUpDto , '/user/login') , authController.postRegister)
Router.get("/user/login" , authController.getLogin)
Router.post("/user/login" , frontValidationMiddleware(SignInDto , '/user/login') , authController.postLogin)
Router.get("/user/logout" , authController.getLogout)

/**
 * User
 */
Router.get("/user" , FrontendAuthenticationMd , userController.getHome)
Router.get('/user/order/:id' , FrontendAuthenticationMd , userController.getOrder)
Router.post('/user/edit' , FrontendAuthenticationMd , frontValidationMiddleware(UserEditDto , '/user') , userController.postEdit)

/**
 * Maintance
 */
Router.get('/maintance' , (req:Request , res:Response) => {
  console.log("Maintance")
  res.render("maintance" , {layout : "master_none"})
})

export default Router
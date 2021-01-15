import express = require('express')

//Middleware
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'
import validationMiddleware from '../middlewares/validation.md'

// DTO
import SignUpDto from '../dto/frontend/signup.dto'
import SignInDto from '../dto/frontend/signIn.dto'

//Controller
import homeController from '../controllers/frontend/frontend_home'
import productController from '../controllers/frontend/frontend_product'
import cartController from '../controllers/frontend/frontend_cart'
import authController from '../controllers/frontend/frontend_auth'
import userController from '../controllers/frontend/frontend_user'
import FrontendAuthenticationMd from '../middlewares/FrontendAuthentication.md'

const Router = express.Router()

Router.use(frontLocalVariableMd)

/**
 * HomePage
 */
Router.get('/' , homeController.getHome)

/**
 * Product
 */
Router.get('/product/:id' , productController.getProduct)


/**
 * Cart
 */
Router.get('/cart' , FrontendAuthenticationMd ,  cartController.getCart)

/**
 * Auth
 */
Router.post("/user/register" , validationMiddleware(SignUpDto) , authController.postRegister)
Router.get("/user/login" , authController.getLogin)
Router.post("/user/login" , validationMiddleware(SignInDto) , authController.postLogin)
Router.get("/user/logout" , authController.getLogout)

/**
 * User
 */
Router.get("/user" , FrontendAuthenticationMd , userController.getHome)

export default Router
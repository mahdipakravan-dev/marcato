import express = require('express')

//Middleware
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'
import validationMiddleware from '../middlewares/validation.md'

// DTO
import SignUpDto from '../dto/frontend/signup.dto'
import SignInDto from '../dto/frontend/signIn.dto'
import api_cart from '../controllers/api/api_cart'
import AuthHandler from '../middlewares/Auth.md'

//Controller


const Router = express.Router()

Router.post('/cart/add' , AuthHandler , api_cart.addCart)
Router.delete("/cart/delete" , AuthHandler , api_cart.deleteCart)
Router.get("/cart/get" , AuthHandler , api_cart.getCart)

export default Router
import express = require('express')

//Middleware
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'
import validationMiddleware from '../middlewares/validation.md'

// DTO
import SignUpDto from '../dto/frontend/signup.dto'
import SignInDto from '../dto/frontend/signIn.dto'
import api_cart from '../controllers/api/api_cart'

//Controller


const Router = express.Router()

Router.post('/cart/add' , api_cart.addCart)

export default Router
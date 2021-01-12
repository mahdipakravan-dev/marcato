import express = require('express')
import authController from '../controllers/auth.controller'
import validationMiddleware from '../middlewares/validation.md'
import SignUpDto from '../dto/signup.dto'
import SignInDto from '../dto/signIn.dto'
import homeController from '../controllers/frontend/frontend_home'
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'

import productController from '../controllers/frontend/frontend_product'

import {Request , Response} from 'express'

const Router = express.Router()

Router.use(frontLocalVariableMd)

Router.get('/' , homeController.getHome)

Router.get('/product/:id' , productController.getProduct)

export default Router
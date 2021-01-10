import express = require('express')
import authController from '../controllers/auth.controller'
import validationMiddleware from '../middlewares/validation.md'
import SignUpDto from '../dto/signup.dto'
import SignInDto from '../dto/signIn.dto'
import homeController from '../controllers/home.controller'
import frontLocalVariableMd from '../middlewares/frontLocalVariable.md'

const Router = express.Router()

Router.use(frontLocalVariableMd)

Router.get('/' , homeController.getHome)

export default Router
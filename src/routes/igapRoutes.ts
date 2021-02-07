import express = require('express')
import ApiIgap from '../controllers/api/api_igap'
import AuthHandler from '../middlewares/Auth.md'

const Router = express.Router()

Router.get("/Users" , ApiIgap.getUsers)
Router.get("/Products" , ApiIgap.getProducts)
Router.get("/Orders" , ApiIgap.getOrders)
Router.get('/Instruments' , ApiIgap.getInstruments)
Router.get('/Categories' , ApiIgap.getCategories)

export default Router
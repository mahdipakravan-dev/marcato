import express, { Application , Request } from "express"
import config from 'config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import flash from 'express-flash'

import PrivateRoutes from './routes/privateRoutes'
import PublicRoutes from './routes/publicRoutes'
import DashboardRoutes from './routes/dashboardRoutes'
import restRoutes from "./routes/restRoutes"

import IpDetector from "./middlewares/ipDetector.md"
import MaintanceModeMd from './middlewares/maintanceMode.md'

import EnvConfig from './configurations/env'
import MongoConfig from './configurations/mongo'
import ViewConfig from './configurations/view'
import ExceptionHandler from "./middlewares/ExceptionHandler.md"

import { AdminModel } from "./models/admin"
import Encrypt from './helpers/Encrypt'
import {adminTypes, productTypes} from './helpers/interfaces'
import { UserModel } from "./models/user"
import { ProductModel } from "./models/product"
import { CategoryModel } from "./models/category"
import Regex from "./helpers/Regex"
import { OptionModel } from "./models/options"
import { OrderModel } from "./models/order"
import { DiscountModel } from "./models/discounts"
import moment from "moment"

/**
  * Repository Design Pattern                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  * Single Responsibility Principle
*/

class App {

    app: Application = express()

    constructor() {
        new EnvConfig()
        new MongoConfig()
        new ViewConfig(this.app)
        this.configServer()
        this.configExpress()
        this.configRoutesAndLog()
        // this.logger.info(`Server Started On ${process.env.HOST}:${process.env.PORT} [${process.env.NODE_ENV}]`)
        // console.log(`Server Started On ${process.env.HOST}:${process.env.PORT} [${process.env.NODE_ENV}]`)

        this.test()
    }

    private configServer(): void {
        this.app.listen(process.env.PORT || 4750)
    }

    private configExpress(): void {
        this.app.use(bodyParser.json(config.get('bodyParserConfig')))
        this.app.use(bodyParser.urlencoded({extended : true}));
        this.app.use(bodyParser.json())
        this.app.use(session({
            secret: config.get("session_secret"),
            saveUninitialized: true,
            resave : true ,
            cookie: { maxAge: 3600000 }
        }))
        this.app.use(cookieParser(config.get("cookie_secret")))
        this.app.use(flash())
    }

    private configRoutesAndLog(): void {

        if(process.env.MAINTANCE_MODE == "enable"){
            this.app.use(MaintanceModeMd)
        }

        this.app.use(IpDetector)
        this.app.use(PublicRoutes)
        this.app.use("/rest" , restRoutes)
        this.app.use("/dashboard" , DashboardRoutes)
        this.app.use(PrivateRoutes)
        this.app.use(ExceptionHandler)
        
        
    }

    private async test(){
        // const hashedPass = await Encrypt.Hash("123456")
        // await new AdminModel().CreateAdmin({
        //     name : "Mahdi" ,
        //     lastName : "Pakravan" ,
        //     username : "mahdipakravan" ,
        //     email : "mahdi@dgisoft.ir" , 
        //     phoneNumber : "09369514975" , 
        //     password : hashedPass ,
        //     address : "Tehran" , 
        //     type : adminTypes.superAdmin ,
        // }).then(result => {
        //     console.log(result)
        // }).catch(err => {
        //     console.log(err)
        // })

        // await new UserModel().CreateUser({
        //     name : "Mahdi", 
        //     family : "Pakravan", 
        //     phone : "09369514975", 
        //     mail : "mahdi@dgisoft.ir", 
        //     insta : "mahdipakravan_", 
        //     birthday : "2000/12/24", 
        //     instruments : ["violin" , "viola"] , 
        //     startedInstrumentAt : [new Date() , new Date()]
        // })

        // await new ProductModel().createProduct({
        //     fullName : "ویولن مولر mb120" , 
        //     enName : "violin-muller-mb120" ,
        //     type : productTypes.PHYSIC , 
        //     price : 200000000 , 
        //     sellCount : 0 ,
        // })

        // await new CategoryModel().CreateCategory({
        //     enName : "percussion" ,
        //     faName : "کوبه ای"
        // })

        // let result = '' , phoneNumber = "09369514975"

        // console.log(phoneNumber.replace(
        //     /(0|\+98)?([ ]|,|-|[()]){0,2}9[1|2|3|4]([ ]|,|-|[()]){0,2}(?:[0-9]([ ]|,|-|[()]){0,2}){8}/ 
        //     , "$1 $2 $3 $4"))

        // await new OptionModel().InitOption()

        // await new OptionModel().EditOption("transportCost" , 35000)
        // await new OptionModel().EditOption("debtPercent" , 0)
        // await new OrderModel().CreateOrder({
        //     userId : string  ,
        //     cart : cartInterface[] ,
        //     status : boolean ,
        //     discountCode ?: string ,
        //     count ?: number ,
        //     price ?: number
        // })

        // await new DiscountModel().CreateDiscount({
        //     code : "discode" ,
        //     percent : 50 , 
        //     max : 2
        // })

        // await new OrderModel().CalculateCart({userId : "5ff09e84f4f1f24804bf006e" , status : "pending"})
        // .then(result => {
        //     console.log("Order Calculated and resolved with" , result)
        // })
        // .catch(err => {
        //     console.log("Order Crashed With " , err)
        // })

    }

}

new App()
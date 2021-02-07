import { OrderModel } from '../../models/order'
import {ProductModel} from '../../models/product'
import { UserModel } from '../../models/user'

import {Request , Response , NextFunction} from 'express'
import {CategoryModel} from "../../models/category";
import {InstrumentModel} from "../../models/instrument";
export default new class ApiIgap {

    async getProducts(req:Request, res:Response , next:NextFunction ){
        let query = {}
        if(req.query.instrument) Object.defineProperty(query , 'instrument.enName' , req.query.instrument)

        console.log(query)
        res.json(await ProductModel.find(query))
    }

    async getUsers(req:Request, res:Response , next:NextFunction){
        res.json(await UserModel.find())
    }

    async getOrders(req:Request, res:Response , next:NextFunction){
        res.json(await OrderModel.find())
    }

    async getCategories(req:Request , res:Response , next:NextFunction){
        res.json(await CategoryModel.find())
    }

    async getInstruments(req:Request , res:Response , next:NextFunction){
        res.json(await InstrumentModel.find())
    }
}
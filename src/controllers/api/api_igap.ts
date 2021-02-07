import { OrderModel } from '../../models/order'
import {ProductModel} from '../../models/product'
import { UserModel } from '../../models/user'

import {Request , Response , NextFunction} from 'express'
export default new class ApiIgap {

    async getProducts(req:Request, res:Response , next:NextFunction ){
        res.json(await ProductModel.find())
    }

    async getUsers(req:Request, res:Response , next:NextFunction){
        res.json(await UserModel.find())
    }

    async getOrders(req:Request, res:Response , next:NextFunction){
        res.json(await OrderModel.find())
    }
}
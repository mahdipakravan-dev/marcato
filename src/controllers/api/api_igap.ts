import { OrderModel } from '../../models/order'
import {ProductModel} from '../../models/product'
import { UserModel } from '../../models/user'
export default new class ApiIgap {

    async getProducts(){
        return await ProductModel.find()
    }

    async getUsers(){
        return await UserModel.find()
    }

    async getOrders(){
        return await OrderModel.find()
    }
}
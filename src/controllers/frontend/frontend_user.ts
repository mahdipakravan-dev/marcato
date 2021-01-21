import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_user {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.token , 
        user = await new UserModel().FindUser({_id : userId}) ,
        orders = await new OrderModel().FindOrders({userId})
        res.render('frontend/user' , {orders , user})
    }
}
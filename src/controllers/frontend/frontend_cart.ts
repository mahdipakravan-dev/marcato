import { Request, Response, NextFunction } from "express";
import { OptionModel } from "../../models/options";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_cart {

    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = await new OrderModel().FindOrder({userId : req.token}) ,
        options = await new OptionModel().GetOptions()  
        res.render('frontend/cart' , {user , options})
    }

    public async addCart(req: Request, res: Response, next: NextFunction){
      
    }

}
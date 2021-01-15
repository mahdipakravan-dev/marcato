import { Request, Response, NextFunction } from "express";
import { OptionModel } from "../../models/options";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_cart {

    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const user = await new UserModel().FindUser({_id : req.token}) ,
        options = await new OptionModel().GetOptions()  
        res.render('frontend/cart' , {user , options})
    }

    public async addCart(req: Request, res: Response, next: NextFunction){
      //Add This Product To user.cart'

      /**
       * 1 - Find That Product
       * 2 - Check user.cart
       * 3 - if(user.cart.product) product.qty++
       * 4 - if(user.cart.product) user.cart.push(product)
       */
      
    }

}
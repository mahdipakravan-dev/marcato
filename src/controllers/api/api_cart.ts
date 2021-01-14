import { Request, Response, NextFunction } from "express";
import { statusCodes } from "../../helpers/interfaces";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class HomeController {

    public async addCart(req: Request, res: Response, next: NextFunction){
      const {productId , userId , qty} = req.body
      const product = await new ProductModel().FindProduct({_id : productId})
      if(!product) res.json().status(statusCodes.NOT_FOUND)
      await new UserModel().FindUser({_id : userId})
      .then(async user => {

        if(!user.cart[0]) {
          await new UserModel().addToCart({_id : userId} , [
            {enName : product.enName , qty , price : product.price}
          ])
          .then(() => {res.json().status(statusCodes.SUCCESS)})
          .catch(() => {res.json().status(statusCodes.INTERNAL)})

        } else {
          let haveIt = false ;
          user.cart.forEach((productInCart: any) => {
            if(productInCart.enName === product.enName) haveIt = true
          })
          res.json().status(statusCodes.CONFLICT)
        }

      })
      .catch(err => {
        throw new Error(err)
      })
    }

}
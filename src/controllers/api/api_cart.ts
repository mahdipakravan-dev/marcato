import { Request, Response, NextFunction } from "express";
import { statusCodes } from "../../helpers/interfaces";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

import autobind from "auto-bind"
import { userInfo } from "os";

export default new class api_cart {

  constructor(){
    autobind(this)
  }

  public async addCart(req: Request, res: Response, next: NextFunction){
    const userId = req.auth.id ,
    {productId , qty} = req.body ,
    product = await new ProductModel().FindProduct({_id : productId})

    if(!product) res.json().status(statusCodes.NOT_FOUND)
    await new UserModel().FindUser({_id : userId})
    .then(async user => {

      //Initialize Cart
      if(!user.cart[0]) {
        await new UserModel().updateCart({_id : userId} , [
          {id : product._id , enName : product.enName , qty , price : product.price , fullName : product.fullName , thumbnail : product.thumbnails[0]}
        ])
        .then(() => {res.json().status(statusCodes.SUCCESS)})
        .catch(() => {res.json().status(statusCodes.INTERNAL)})

      } else {
        //Check TO Have

        let haveIt = false , newCart = [];
        for(let i = 0 ; i < user.cart.length ; i++){  
          if(user.cart[i].id == productId) haveIt = true
          else newCart.push(user.cart[i])
        }
        if(haveIt) {
          res.json().status(statusCodes.CONFLICT)
        } else {
          newCart.push({id : product._id , enName : product.enName , qty , price : product.price , fullName : product.fullName , thumbnail : product.thumbnails[0]})
          await new UserModel().updateCart({_id : userId} , newCart)
          res.json().status(statusCodes.SUCCESS)
        }
      }

    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async deleteCart(req: Request, res: Response, next: NextFunction){
    const userId = req.auth.id , 
    {productId} = req.body ,
    user = await new UserModel().FindUser({_id : userId})
    
    if(!user) return res.json().status(statusCodes.NOT_FOUND)

    let newCart = [] 
    for(let i = 0 ; i < user.cart.length ; i++){  
      if(user.cart[i].id != productId) newCart.push(user.cart[i]) ;   
    }
    await new UserModel().updateCart({_id : userId} , newCart)
    res.json().status(statusCodes.SUCCESS)
  }

  public async updateCart(req: Request, res: Response, next: NextFunction){
    //Get mm pp 
  }

  public async getCart(req: Request, res: Response, next: NextFunction){
    const user = await new UserModel().FindUser({_id : req.auth.id})
    res.json(user.cart || [])
  }
}
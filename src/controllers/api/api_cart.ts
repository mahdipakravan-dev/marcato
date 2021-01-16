import { Request, Response, NextFunction } from "express";
import { statusCodes } from "../../helpers/interfaces";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

import autobind from "auto-bind"
import { userInfo } from "os";
import { OrderModel } from "../../models/order";

export default new class api_cart {

  constructor(){
    autobind(this)
  }

  public async addCart(req: Request, res: Response, next: NextFunction){
    const userId = req.auth.id ,
    {productId , qty} = req.body ,
    product = await new ProductModel().FindProduct({_id : productId})

    if(!product) res.json().status(statusCodes.NOT_FOUND)
    await new OrderModel().FindOrder({userId})
    .then(async order => {
      //Initialize Cart
      if(!order) {
        return await new OrderModel().InitOrder(userId , [{id : product._id , enName : product.enName , qty , price : product.price , fullName : product.fullName , thumbnail : product.thumbnails[0]}])
        .then(() => {res.json().status(statusCodes.SUCCESS)})
        .catch(() => {res.json().status(statusCodes.INTERNAL)})
      }

      let haveIt = false , newCart = [];
      for(let i = 0 ; i < order.cart.length ; i++){  
        if(order.cart[i].id == productId) haveIt = true
        else newCart.push(order.cart[i])
      }
      if(haveIt) {
        res.json().status(statusCodes.CONFLICT)
      } else {
        newCart.push({id : product._id , enName : product.enName , qty : 1, price : product.price , fullName : product.fullName , thumbnail : product.thumbnails[0]})
        await new OrderModel().UpdateCart({userId} , newCart)
        res.json().status(statusCodes.SUCCESS)
      }

    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async deleteCart(req: Request, res: Response, next: NextFunction){
    const userId = req.auth.id , 
    {productId} = req.body ,
    user = await new OrderModel().FindOrder({userId})
    
    if(!user) return res.json().status(statusCodes.NOT_FOUND)

    let newCart = [] 
    for(let i = 0 ; i < user.cart.length ; i++){  
      if(user.cart[i].id != productId) newCart.push(user.cart[i]) ;   
    }
    await new OrderModel().UpdateCart({userId} , newCart)
    res.json().status(statusCodes.SUCCESS)
  }

  public async updateCart(req: Request, res: Response, next: NextFunction){
    const {productId , qty} = req.body ,
    userId = req.auth.id , 
    user = await new OrderModel().FindOrder({userId})

    if(!user) return res.json().status(statusCodes.NOT_FOUND)

    console.log(productId , typeof qty)

    let newCart = [] 
    for(let i = 0 ; i < user.cart.length ; i++){  
      if(user.cart[i].id != productId) newCart.push(user.cart[i]) ;   
      else newCart.push(
        {
          id : user.cart[i].id , 
          enName : user.cart[i].enName , 
          qty : parseInt(qty) , 
          price : user.cart[i].price , 
          fullName : user.cart[i].fullName , 
          thumbnail : user.cart[i].thumbnail
        }
      )
    }

    await new OrderModel().UpdateCart({userId} , newCart)
    .then(() => {res.json().status(statusCodes.SUCCESS)})
    .catch(err => {res.json().status(statusCodes.INTERNAL)})

  }

  public async getCart(req: Request, res: Response, next: NextFunction){
    const order = await new OrderModel().FindOrder({userId : req.auth.id})
    res.json(order)
  }
}
import { NextFunction , Request , Response } from "express";
import config from 'config'
import Jwt from "../helpers/jwt";
import { UserModel } from "../models/user";

export default async function(req:Request , res:Response , next:NextFunction){
  const user = Jwt.authenticator(req!.cookies!.frontendToken)
  req.app.locals.projectName = config.get("projectName") || "مارکاتو"
  req.app.locals.loggedIn = false

  if(req.cookies.frontendToken && user) {
    req.app.locals.loggedIn = true
    req.app.locals.auth = user.userData
  }

  req.app.locals.helper = {
    decimaller(number:any){
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
    } , 

    linkToProducts(page:number){return `/products?page=${page}`},

    linkToProduct(productId : string){
      return `/product/${productId}`
    },
    linkToCategory(category : string){
      return `/products-category/${category}`
    } ,
    linkToInstrument(instrument : string) {
      return `/products-instrument/${instrument}`
    },

    orderStatus(status:string){
      switch(status) {
        case "cancel" :
          return {type : "badge" , badge : "badge badge-danger" , text : "کنسل شده"}
          break
        case "pending" :
          return {type : "badge" , badge : "badge badge-primary" , text : "پرداخت نشده(به سبد خرید مراجعه کنید)"}
          break
        case "success" :
        return {type : "badge" , badge : "badge badge-success" , text : "تکمیل(ارسال شده و دریافت شده)"}
        break
        default :
          return {type : "badge" , badge : "badge badge-warning" , text : "با پشتیبانی تماس بگیرید"}
      }
    }
  }


  req.app.locals.url = process.env.URL

  next()
}
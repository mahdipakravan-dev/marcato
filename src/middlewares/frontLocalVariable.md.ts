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
      const toman = number.toString().slice(0,-1)
      return toman.replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
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
        case "pending" :
          return {type : "badge" , badge : "badge badge-primary" , text : "پرداخت نشده(به سبد خرید مراجعه کنید)"}
        case "success" :
          return {type : "badge" , badge : "badge badge-success" , text : "تکمیل(ارسال شده و دریافت شده)"}
        case "paid" :
          return {type : "badge" , badge : "badge badge-success" , text : "پرداخت شده/درحال آماده سازی"}
        case "sending" :
          return {type : "badge" , badge : "badge badge-success" , text : "ارسال شده و تو راهه..."}
        default :
          return {type : "badge" , badge : "badge badge-warning" , text : "با پشتیبانی تماس بگیرید"}
      }
    } ,
    
    orderLink(item:any){

      switch(item.status) {
        case "cancel" :
          return {type : "button" , link : `` ,button : "btn-sm " ,text : 'برای پیگیری با پشتیبانی تماس بگیرید'}
        case "pending" :
          return {type : "button" , link : `/cart` ,button : "btn-sm p-3 btn-primary" ,text : 'سبدخرید'}
        case "success" :
          return {type : "button" , link : `/user/order/${item._id}` ,button : "btn-sm p-3 btn-primary" ,text : 'فاکتور'}
        case "paid" :
          return {type : "button" , link : `/user/order/${item._id}` ,button : "btn-sm p-3 btn-primary" ,text : 'پیگیری/فاکتور'}
        case "sending" :
          return {type : "button" , link : `/user/order/${item._id}` ,button : "btn-sm p-3 btn-primary" ,text : 'پیگیری/فاکتور'}
        default :
          return {type : "badge" , badge : "badge badge-warning" , text : "با پشتیبانی تماس بگیرید"}
      }
    } ,

    orderStatusTranslator(status:string){
      switch(status) {
        case "cancel" :
          return "کنسل شده"
        case "pending" :
          return "پرداخت نشده"
        case "success" :
          return "تکمیل(ارسال شده و دریافت شده)"
        case "paid" :
          return "پرداخت شده و درحال آماده سازی"
        case "sending" :
          return "درحال رسیدن"
      }
    } ,
  }
  req.app.locals.error = req.flash('error')
  req.app.locals.errors = req.flash('errors')
  req.app.locals.success = req.flash('success')
  req.app.locals.url = process.env.URL

  next()
}
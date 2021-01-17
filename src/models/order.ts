import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes, cartInterface} from '../helpers/interfaces'
import { DiscountModel } from './discounts'


export interface IOrder extends Document {
  userId : string 
  cart : cartInterface[]
  status : boolean
  discountCode ?: string
  count ?: number
  price ?: number
  UpdateOrder(query:any , val : any):Promise<any>
  FindOrder(query:any):Promise<any>
  InitOrder(userId : string , cart : cartInterface[]) : Promise<any>
  UseDiscount(discountCode : string , query : any) : Promise<any>
  CalculateCart(query:any) : Promise<any>
}

const OrderSchema: Schema = new Schema({
  userId : {type : mongoose.Types.ObjectId , required : true , ref : "users" } ,
  cart : {type : Array , default : []} , 
  status : {type : String , default : "pending"} , // pending , error , success
  discountCode : {type : String},
  count : {type : Number},
  price : {type : Number} ,
  finalPrice : {type : Number} 
})

/**
 * 
 * @param query 
 * @param val
 * Update Cart And ReCalculate Order 
 */
OrderSchema.methods.UpdateOrder = function(query:any , val : any){
  return new Promise((resolve , reject) => {
    OrderModel.updateOne(query , val)  
    .then(async result => {
      await new OrderModel().CalculateCart(query)
      .then(result => resolve(result))
      .catch(err => reject(err))
    })
    .catch(err => {reject(err)})
  })
}

/**
 * 
 * @param query 
 * Find Order
 */
OrderSchema.methods.FindOrder = function(query:any){
  return new Promise((resolve , reject) => {
    OrderModel.findOne(query)  
    .then(result => resolve(result))
    .catch(err => {reject(err)})
  })
}

/**
 * 
 * @param userId 
 * @param cart 
 * Check And Initialize Pending Order
 */
OrderSchema.methods.InitOrder = function(userId:any , cart : cartInterface[]){
  return new Promise(async (resolve , reject) => {
    await new OrderModel().FindOrder({userId})
    .then(result => {
      let price = 0 , count = 0 ;
      cart.forEach((newCartItem:any) => {price += (newCartItem.price * newCartItem.qty) ; count++})
    new OrderModel({
      userId , 
      cart ,
      count , 
      price
    }).save()
    .then(result => resolve(result))
    .catch(err => {reject(err)})
    })
    .catch(err => {reject(err)})
  })
}

/**
 * @param query 
 * Calculate a Cart
 */
OrderSchema.methods.CalculateCart = function(query:any){
  return new Promise(async (resolve , reject) => {
    await new OrderModel().FindOrder(query)
    .then(async result => {
      let price = 0 , finalPrice = 0
      result.cart.forEach((newCartItem:any) => {price += (newCartItem.price * newCartItem.qty);})
      

      if(result.discountCode) {
        await new DiscountModel().CheckDiscount(result.discountCode)
        .then(discount => {
          if(!discount) reject("No Discount")
          finalPrice = price - (discount.percent * price) / 100
        })
        .catch(err => reject(err))
      } else finalPrice=price

      await OrderModel.updateOne(query , {price , finalPrice})
      .then(result => {resolve(result)})
      .catch(err => {reject(err)})

    })
    .catch(errResult => {throw new Error(errResult)})
  })
}

export const OrderModel = mongoose.model<IOrder>('orders', OrderSchema)
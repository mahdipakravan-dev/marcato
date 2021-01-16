import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes, cartInterface} from '../helpers/interfaces'


export interface IOrder extends Document {
  userId : string 
  cart : cartInterface[]
  status : boolean
  discountCode ?: string
  count ?: number
  price ?: number
  UpdateCart(query:any , newCart : cartInterface[]):Promise<any>
  FindOrder(query:any):Promise<any>
  InitOrder(userId : string , cart : cartInterface[]) : Promise<any>
}

const OrderSchema: Schema = new Schema({
  userId : {type : mongoose.Types.ObjectId , required : true , ref : "users" } ,
  cart : {type : Array , default : []} , 
  status : {type : String} , // pending , error , success
  discountCode : {type : String},
  count : {type : Number},
  price : {type : Number}
})

OrderSchema.methods.UpdateCart = function(query:any , newCart : cartInterface[]){
  return new Promise((resolve , reject) => {
    let price = 0
    newCart.forEach((newCartItem:any) => {price += (newCartItem.price * newCartItem.qty)})
    OrderModel.updateOne(query , {cart : newCart , price})  
    .then(result => resolve(result))
    .catch(err => {reject(err)})
  })
}

OrderSchema.methods.FindOrder = function(query:any){
  return new Promise((resolve , reject) => {
    OrderModel.findOne(query)  
    .then(result => resolve(result))
    .catch(err => {reject(err)})
  })
}

OrderSchema.methods.InitOrder = function(userId:any , cart : cartInterface[]){
  return new Promise((resolve , reject) => {
    let price = 0 , count = 0 ;
    cart.forEach((newCartItem:any) => {price += (newCartItem.price * newCartItem.qty) ; count++})
    new OrderModel({
      userId , 
      cart ,
      status : "pending" ,
      count , 
      price
    }).save()
    .then(result => resolve(result))
    .catch(err => {reject(err)})
  })
}

export const OrderModel = mongoose.model<IOrder>('orders', OrderSchema)
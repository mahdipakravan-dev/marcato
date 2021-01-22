import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes, cartInterface} from '../helpers/interfaces'
import { DiscountModel } from './discounts'
import { OrderModel } from './order'


export interface IPayment extends Document {
  orderId : string ,
  internalStatus ?: number,
  status ?: string
  amount : number ,
  transId ?:  number,
  refnumber ?: string ,
  trackingCode ?: string ,
  factorNumber ?: string,
  mobile ?: string,
  description ?: string ,
  cardNumber ?: string ,
  CID ?: string ,
  paymentDate ?: string ,
  message ?: string 

  CreatePayment(orderId : string , payment : any):Promise<any>
  UpdatePayment(query : any , value : any):Promise<void>
  DeletePayment(query:any) : Promise<void>
}

const PaymentSchema: Schema = new Schema({
  orderId : {type : String , required : true} ,
  internalStatus : {type : Number , default : 1} , // 1- have token | 2-redirected | 3-callbacked(verifying) | 4-failed | 5-Success
  status : {type : String , default : ""} ,
  amount : {type : Number , required : true} ,
  transId : {type : String},
  refnumber : {type : String} ,
  trackingCode : {type : String} ,
  factorNumber : {type : String},
  mobile : {type : String},
  description : {type : String} ,
  cardNumber : {type : String} ,
  CID : {type : String} ,
  paymentDate : {type : String} ,
  message : {type : String} 
})

PaymentSchema.methods.CreatePayment = function(orderId : string ,payment : any){
  return new Promise(async (resolve , reject) => {
    if(await PaymentModel.findOne({orderId})) PaymentModel.updateOne({orderId} , {internalStatus : 4})
    await new PaymentModel(payment).save()
    .then(async paymentResult => {
      await new OrderModel().UpdateOrder({_id : payment.orderId} , {payId : paymentResult})
      .then(() => resolve(paymentResult))
      .catch(err => reject(err))
    })
    .then(result => {console.log(result);resolve(result)})
    .catch(err => reject(err))
  })
}

PaymentSchema.methods.UpdatePayment = function(query : any , value : any){
  return new Promise((resolve , reject) => {
    PaymentModel.updateOne(query , value)
    .then(result => resolve(result))
    .catch(err => reject(err))
  })
}

PaymentSchema.methods.DeletePayment = function(query : any){
  return new Promise((resolve , reject) => {
    PaymentModel.updateOne(query , {internalStatus : 4})
    .then(result => resolve(result))
    .catch(err => reject(err))
  })
}

export const PaymentModel = mongoose.model<IPayment>('payments', PaymentSchema)
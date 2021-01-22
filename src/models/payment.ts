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
  token ?: string

  CreatePayment(orderId : string , payment : any):Promise<any>
  UpdatePayment(query : any , value : any):Promise<void>
  DeletePayment(query:any) : Promise<void>
  PaymentSuccess(token:string , transactionResult : any):Promise<void>
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
  message : {type : String} ,
  token : {type : String , default : "noToken"}
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
  return new Promise(async (resolve , reject) => {
    await PaymentModel.updateOne(query , value)
    .then(result => resolve(result))
    .catch(err => reject(err))
  })
}

PaymentSchema.methods.DeletePayment = function(query : any){
  return new Promise(async (resolve , reject) => {
    await PaymentModel.updateOne(query , {internalStatus : 4 , message : "canceledOrBug"})
    .then(result => {console.log(result,"dResult");resolve(result)})
    .catch(err => {console.log(err,"dError");reject(err)})
  })
}

PaymentSchema.methods.PaymentSuccess = function(token : string , transactionResult : any){
  return new Promise(async (resolve , reject) => {
    /**
     * 1- Find Payment By token
     * 2- Change 
     */
    transactionResult.internalStatus = 5
    const payment = await PaymentModel.findOneAndUpdate({token , internalStatus : 3} , transactionResult)
    if(!payment) throw new Error("something Wrong : Payment With internalStatus 3 Not Found !")
    await new OrderModel().UpdateOrder({payId : payment._id} , {status : 'paid'})
    .then(result => {resolve(result)})
    .catch(err => {reject(err)})
  })
}

export const PaymentModel = mongoose.model<IPayment>('payments', PaymentSchema)
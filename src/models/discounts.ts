import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes} from '../helpers/interfaces'
import { OrderModel } from './order'


export interface IDiscount extends Document {
  code : string ,
  percent : number 
  createdBy : string
  max : number
  used : number
  CreateDiscount(discount:any):Promise<any>
  UseDiscount(code:string , userId : string):Promise<any>
  DisableDiscount(code:string , userId : string):Promise<any>
  CheckDiscount(code:string):Promise<any>
}

const discountSchema: Schema = new Schema({
  code : {type : String , unique : true , required : true} ,
  percent : {type : Number , required : true } , 
  createdBy : {type : String , default : "unknown"} ,
  max : {type : Number , default : 0} ,
  used : {type : Number , default : 0}
})

discountSchema.methods.CreateDiscount = function(discount:any){
    return new Promise((resolve , reject) => {
        new DiscountModel(discount).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

discountSchema.methods.CheckDiscount = function(code:string){
  return new Promise(async (resolve , reject) => {
      await DiscountModel.findOne({code})
      .then(result => {
        console.log(result)
        if(!result) return reject("Not Found")
        else if(result.used != result.max) {
          resolve(result)
          // discountCode.used++
        }
      })
      .catch(err => {reject(err)})
  })
}

discountSchema.methods.UseDiscount = function(code:string , userId : string){
  return new Promise(async (resolve , reject) => {

    await new DiscountModel().CheckDiscount(code)
    .then(async () => {
       
      await new OrderModel().FindOrder({userId , status : "pending"})
      .then(async order => {

        if(order.discountCode) throw new Error("discountUsed")

        await new OrderModel().UpdateOrder({userId , status : "pending"} , {discountCode : code})
        .then(result => resolve(result))
        .catch(err => reject(err))

      })

    .catch(err => {reject(err)})
     })
    .catch(err => {reject(err)})
  })
}

discountSchema.methods.DisableDiscount = function(code:string , userId : string){
  return new Promise(async (resolve , reject) => {
    
    await new OrderModel().FindOrder({userId , status : "pending"})
    .then(async order => {

      await new OrderModel().UpdateOrder({userId , status : "pending"} , {discountCode : ""})
      .then(result => resolve(result))
      .catch(err => reject(err))

    })
    .catch(err => {throw new Error(err)})

  })
}

export const DiscountModel = mongoose.model<IDiscount>('discounts', discountSchema)
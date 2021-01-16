import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes} from '../helpers/interfaces'


export interface IDiscount extends Document {
  code : string ,
  percent : number 
  createdBy : string
  max : number
  used : number
  CreateDiscount(discount:any):Promise<any>
  UseDiscount(code:string):Promise<any>
}

const discountSchema: Schema = new Schema({
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

discountSchema.methods.UseDiscount = function(code:string){
  return new Promise(async (resolve , reject) => {
      await DiscountModel.findOne({code})
      .then(result => {
        if(!result) return reject("Not Found")
        return resolve(result)
      })
      .catch(err => {reject(err)})
  })
}

export const DiscountModel = mongoose.model<IDiscount>('discounts', discountSchema)
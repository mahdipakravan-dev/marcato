import mongoose, { Schema, Document } from 'mongoose'
import {productInterface, productTypes, requestFiles} from '../helpers/interfaces'

export interface IProduct extends Document {
  fullName : string , 
  enName : string ,
  type : productTypes , 
  price : number , 
  sellCount : number ,
  desc : string , 
  category : string , 
  instrument : string ,
  thumbnails : requestFiles[] ,
  createProduct(product:productInterface) : Promise<any>
}

const productSchema : Schema = new Schema({
  fullName : {type : String , required : true} , 
  enName : {type : String , required : true , unique : true} ,
  desc : {type : String , required : true , default : "توضیحات اضافی وارد نشده است"} ,
  type : {type : String , required : true} , 
  price : {type : Number , required : true , default : 0} , 
  sellCount : {type : Number , required : true , default : 0} ,
  thumbnails : {type : Array , require : true , default : ["noImage.png"]} , 
  category : {type : String , required : true} , 
  instrument : {type : String , required : true}
})

productSchema.methods.createProduct = function(product:productInterface){
    return new Promise((resolve , reject) => {
        new ProductModel(product).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const ProductModel = mongoose.model<IProduct>('product', productSchema)
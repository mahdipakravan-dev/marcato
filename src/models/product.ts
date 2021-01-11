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
  instrument : {enName : string , faName : string} ,
  thumbnails : requestFiles[] ,
  CreateProduct(category : productInterface) : Promise<any>
  DeleteProduct(id:string) : Promise<any>
  FindProduct(id:string) : Promise<any>
  Find(query:any) : Promise<any>
  EditProduct(id:string , category:productInterface) : Promise<any>
}

const productSchema : Schema = new Schema({
  fullName : {type : String , required : true} , 
  enName : {type : String , required : true , unique : true} ,
  desc : {type : String , default : "توضیحات اضافی وارد نشده است"} ,
  type : {type : String , required : true} , 
  price : {type : Number , required : true , default : 0} , 
  sellCount : {type : Number , required : true , default : 0} ,
  thumbnails : {type : Array  , default : ["https://i.stack.imgur.com/y9DpT.jpg"]} , 
  category : {type : String  , default : "دسته بندی نشده"} , 
  instrument : {type : Object , default : {enName : "none" , faName : "انتخاب نشده"}}
})

productSchema.methods.CreateProduct = function(product:productInterface){
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

productSchema.methods.DeleteProduct = function(id:string){
  return new Promise((resolve , reject) => {
      ProductModel.deleteOne({_id : id})
      .then(result => {resolve(result)})
      .catch(err => {reject(err)})
  })
}

productSchema.methods.EditProduct = function(id:string , newChange : productInterface){
  return new Promise((resolve , reject) => {
      ProductModel.updateOne({_id : id} , newChange)
      .then(result => {
          resolve(result)
      })
      .catch(err => {
          reject(err)
      })
  })
}

productSchema.methods.FindProduct = function(id:string){
  return new Promise((resolve , reject) => {
      ProductModel.findOne({_id : id})
      .then(result => {
          resolve(result)
      })
      .catch(err => {
          reject(err)
      })
  })
}

productSchema.methods.Find = function(query : any){
  return new Promise((resolve , reject) => {
      ProductModel.find(query)
      .then(result => {
          resolve(result)
      })
      .catch(err => {
          reject(err)
      })
  })
}

export const ProductModel = mongoose.model<IProduct>('product', productSchema)
import mongoose, { Schema, Document } from 'mongoose'
import {productInterface, productTypes, requestFiles} from '../helpers/interfaces'
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts'

import moment from 'moment'

export interface IProduct extends Document {
  fullName : string , 
  enName : string ,
  type : productTypes , 
  price : number , 
  sellCount : number ,
  desc : string , 
  category : {enName : string , faName : string } , 
  instrument : {enName : string , faName : string} ,
  thumbnails : requestFiles[] ,
  CreateProduct(category : productInterface) : Promise<any>
  DeleteProduct(query : any) : Promise<any>
  FindProduct(query:any) : Promise<any>
  Find(query:any) : Promise<any>
  Sort(query:any , sort:any , limit:number) : Promise<any>
  Paginate(query:any) : Promise<any>
  EditProduct(id:string , category:productInterface) : Promise<any>
  SearchRegex(query : string) : Promise<any>
}

const productSchema : Schema = new Schema({
  fullName : {type : String , required : true} , 
  enName : {type : String , required : true , unique : true} ,
  desc : {type : String , default : "توضیحات اضافی وارد نشده است"} ,
  type : {type : String , default : "physic"} , 
  price : {type : Number , default : 0} , 
  sellCount : {type : Number , required : true , default : 0} ,
  thumbnails : {type : Array  , default : ["https://i.stack.imgur.com/y9DpT.jpg"]} , 
  category : {type : Object , default : {enName : "none" , faName : "انتخاب نشده"}} , 
  instrument : {type : Object , default : {enName : "none" , faName : "انتخاب نشده"}} ,
  created_at : {type : Date }
})

productSchema.plugin(mongoosePagination)

productSchema.pre("save" , function(next : mongoose.HookNextFunction) {
    this.created_at = moment().format("YYYY-MM-DD H:mm:ss")
    next()
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

productSchema.methods.DeleteProduct = function(query : any){
  return new Promise((resolve , reject) => {
      ProductModel.deleteOne(query)
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

productSchema.methods.FindProduct = function(query:any){
  return new Promise((resolve , reject) => {
      ProductModel.findOne(query)
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

productSchema.methods.Sort = function(query:any , sort:any , limit:number){
    return new Promise((resolve , reject) => {
        ProductModel.find(query)
        .sort(sort)
        .limit(limit)
        .exec((err:any,products:productInterface) => {
            if(err) reject(err)
            else resolve(products)
        })
    })
}

productSchema.methods.Paginate = function(query:any){
    return new Promise((resolve , reject) => {
        ProductModel.paginate(query)
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}

productSchema.methods.SearchRegex = function(query:string){
    return new Promise((resolve , reject) => {
        ProductModel.find({fullName : {$regex : query}})
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}

export const ProductModel = mongoose.model<IProduct , Pagination<IProduct>>('product', productSchema)
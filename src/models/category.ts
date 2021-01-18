import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes, categoryInterface} from '../helpers/interfaces'

export interface ICategory extends Document {
  faName : string , 
  enName : string ,
  CreateCategory(category : categoryInterface) : Promise<any>
  DeleteCategory(id:string) : Promise<any>
  FindCategory(query : any) : Promise<any>
  Find(query:any) : Promise<any>
  EditCategory(id:string , category:categoryInterface) : Promise<any>
}

const categorySchema : Schema = new Schema({
    faName : {type : String , required : true} , 
    enName : {type : String , unique : true , required : true}
})

categorySchema.methods.CreateCategory = function(category:categoryInterface){
    return new Promise((resolve , reject) => {
        new CategoryModel(category).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

categorySchema.methods.DeleteCategory = function(id:string){
    return new Promise((resolve , reject) => {
        CategoryModel.deleteOne({_id : id})
        .then(result => {resolve(result)})
        .catch(err => {reject(err)})
    })
}

categorySchema.methods.EditCategory = function(id:string , category : categoryInterface){
    return new Promise((resolve , reject) => {
        CategoryModel.updateOne({_id : id} , category)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

categorySchema.methods.FindCategory = function(query:any){
    return new Promise((resolve , reject) => {
        CategoryModel.findOne(query)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

categorySchema.methods.Find = function(query : any){
    return new Promise((resolve , reject) => {
        CategoryModel.find(query)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const CategoryModel = mongoose.model<ICategory>('categories', categorySchema)
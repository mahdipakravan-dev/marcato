import mongoose, { Schema, Document } from 'mongoose'
import { NextFunction } from 'express'
import { cartInterface, userInterface } from '../helpers/interfaces'

export interface IUser extends Document {
    name : string , 
    username : string ,
    family : string , 
    phone : string , 
    mail : string , 
    insta : string , 
    birthday : string , 
    password : string ,
    cart : cartInterface[]

    CreateUser(user:userInterface):Promise<any>
    FindUser(query:any):Promise<any>
    addToCart(query:any , newCart :any):Promise<any>
}

const UserSchema: Schema = new Schema({
    name : { type :String } , 
    family : { type :String } ,
    phone : { type :String , required : true} , 
    mail : { type :String } , 
    insta : { type :String } , 
    birthday : { type :String } , 
    password : {type : String , required:true} , 
    cart : {type : Array , default : [] }
})

UserSchema.methods.CreateUser = function(user:userInterface){
    return new Promise((resolve , reject) => {
        new UserModel(user).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

UserSchema.methods.FindUser = function(query:any){
    return new Promise((resolve , reject) => {
        UserModel.findOne(query)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
  }

UserSchema.methods.addToCart = function(query:any , newCart : any){
    return new Promise((resolve , reject) => {
      UserModel.updateOne(query , {cart : newCart})  
      .then(result => resolve(result))
      .catch(err => {reject(err)})
    })
}

export const UserModel = mongoose.model<IUser>('users', UserSchema)
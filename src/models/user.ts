import mongoose, { Schema, Document } from 'mongoose'
import { NextFunction } from 'express'

export interface IUser extends Document {
    name : string , 
    username : string ,
    family : string , 
    phone : string , 
    mail : string , 
    insta : string , 
    birthday : string , 
    password : string ,
    startedInstrumentAt : string[]

    CreateUser(user:any):Promise<any>
}

const UserSchema: Schema = new Schema({
    name : { type :String , required : true} , 
    family : { type :String , required : true} ,
    phone : { type :String } , 
    mail : { type :String , required : true} , 
    insta : { type :String } , 
    birthday : { type :String } , 
    password : {type : String , required:true}
})

UserSchema.methods.CreateUser = function(user:any){
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

export const UserModel = mongoose.model<IUser>('users', UserSchema)
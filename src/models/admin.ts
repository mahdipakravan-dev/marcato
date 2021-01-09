import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes} from '../helpers/interfaces'


export interface IAdmin extends Document {
  name : string ,
  lastName : string ,
  username : string ,
  email : string , 
  phoneNumber : string , 
  password : string ,
  address : string , 
  type : adminTypes ,
  profile : string ,
  CreateAdmin(admin:any):Promise<any>
}

const adminSchema: Schema = new Schema({
    name : {type : String} ,
    lastName : {type : String} ,
    username : {type : String , unique : true , required : true} ,
    email : {type : String , unique : true} , 
    phoneNumber : {type : String , unique : true , required : true} , 
    password : {type : String , required : true} ,
    address : {type : String } , 
    type : {type : String , required : true , default : 'teacher'} ,
    profile : {type:String , default : "noImage.png"}
})

adminSchema.methods.CreateAdmin = function(admin:any){
    return new Promise((resolve , reject) => {
        new AdminModel(admin).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const AdminModel = mongoose.model<IAdmin>('admin', adminSchema)
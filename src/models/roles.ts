import mongoose, { Schema, Document } from 'mongoose'
import {adminTypes} from '../helpers/interfaces'

import {dashboardSidebarInterface} from '../helpers/interfaces'

export interface IRoles extends Document {
  type : adminTypes ,
  access : dashboardSidebarInterface[] ,
  CreateRole(roles:any):Promise<any> , 
  AddRole(type : string , ) : Promise<any>
}

const roleSchema : Schema = new Schema({
    type : {type : String , required : true , unique : true , default : 'teacher'} ,
    access : {type : Array , required : true }
})

roleSchema.methods.CreateRole = function(role:any){
    return new Promise((resolve , reject) => {
        new RoleModel(role).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const RoleModel = mongoose.model<IRoles>('role', roleSchema)
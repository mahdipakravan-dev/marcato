import mongoose, { Schema, Document } from 'mongoose'
import {instrumentInterface} from '../helpers/interfaces'

export interface IInstrument extends Document {
  faName : string , 
  enName : string ,
  CreateInstrument(category : instrumentInterface) : Promise<any>
  DeleteInstrument(id:string) : Promise<any>
  FindInstrument(id:string) : Promise<any>
  Find(query:any) : Promise<any>
  EditInstrument(id:string , category:instrumentInterface) : Promise<any>
}

const instrumentSchema : Schema = new Schema({
    faName : {type : String , required : true} , 
    enName : {type : String , unique : true , required : true}
})

instrumentSchema.methods.CreateInstrument = function(category:instrumentInterface){
    return new Promise((resolve , reject) => {
        new InstrumentModel(category).save()
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

instrumentSchema.methods.DeleteInstrument = function(id:string){
    return new Promise((resolve , reject) => {
        InstrumentModel.deleteOne({_id : id})
        .then(result => {resolve(result)})
        .catch(err => {reject(err)})
    })
}

instrumentSchema.methods.EditInstrument = function(id:string , category : instrumentInterface){
    return new Promise((resolve , reject) => {
        InstrumentModel.updateOne({_id : id} , category)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

instrumentSchema.methods.FindInstrument = function(id:string){
    return new Promise((resolve , reject) => {
        InstrumentModel.findOne({_id : id})
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

instrumentSchema.methods.Find = function(query : any){
    return new Promise((resolve , reject) => {
        InstrumentModel.find(query)
        .then(result => {
            resolve(result)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export const InstrumentModel = mongoose.model<IInstrument>('instruments', instrumentSchema)
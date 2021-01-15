import mongoose, { Schema, Document } from 'mongoose'
import {productInterface, productTypes, requestFiles} from '../helpers/interfaces'

export interface IOption extends Document {
  debtPercent : {name : string , value : any}
  transportCost : {name : string , value : any}
  
  InitOption() : Promise<void>
  EditOption(option : string , value : any) : Promise<any>
  GetOptions() : Promise<any>
}

const optionSchema : Schema = new Schema({
  debtPercent : {type : Number , default : 0} ,
  transportCost : {type : Number , default : 250000}
})

optionSchema.methods.InitOption = function(){
  return new Promise(async (resolve , reject) => {
    const test = await OptionModel.find({})
    if(test[0]) throw new Error("Inited Before")
    new OptionModel().save()
    .then(resolve)
    .catch(reject)
  })
}

optionSchema.methods.EditOption = function(optionName:string , value : any){
    return new Promise((resolve , reject) => {
        OptionModel.findOne()
        .then((result : any)=> {
          if(!result) throw new Error("No Options Found")

          result[optionName] = value

          console.log(result[optionName] )
          console.log(result)
          OptionModel.updateOne({_id : result.id} , result)
          .then(result => {console.log(result)})
          .catch(err => {throw new Error(err)})
        })
        .catch(err => reject(err))
    })
}

optionSchema.methods.GetOptions = function(){
  return new Promise((resolve , reject) => {
      OptionModel.findOne()
      .then(result => resolve(result))
      .catch(err => reject(err))
  })
}

export const OptionModel = mongoose.model<IOption>('options', optionSchema)
import {Request , Response  , NextFunction} from 'express'
import Encrypt from '../../helpers/Encrypt'
import { AdminModel } from '../../models/admin'
import { CategoryModel } from '../../models/category'
import { InstrumentModel } from '../../models/instrument'
import { ProductModel } from '../../models/product'
import { RoleModel } from '../../models/roles'

import {requestFiles} from '../../helpers/interfaces'

import config from 'config'

import sharp from 'sharp'
import autoBind from 'auto-bind'

export default new class dashboard_product {

  constructor(){
    autoBind(this)
  }

  public async getProducts(req : Request , res:Response , next:NextFunction){
    const products = await ProductModel.find()
    res.render("dashboard/pages/products/getProducts" , {pageName : "محصولات" , products , layout : "dashboard/master_dashboard"})
  }

  
  public async getNewProduct(req:Request , res:Response , next:NextFunction){
    const instruments = await new InstrumentModel().Find({}) ,
    categories = await new CategoryModel().Find({})
    res.render("dashboard/pages/products/newProduct" , {instruments , categories , layout : "dashboard/master_dashboard"})
  }

  private async thumbnailProccess(files:requestFiles[]){
    let thumbnails = [{}]
    //Processing Images
    await files.forEach((file : requestFiles) => {
      const dest = file.destination.replace("./public/" , '')
      //`${process.env.URL}${dest}${file.filename}`
      thumbnails.push({
        original : `${process.env.URL}${dest}${file.filename}` , 
        small : `${process.env.URL}${dest}small-${file.filename}` , 
        normal : `${process.env.URL}${dest}normal-${file.filename}` ,
        big : `${process.env.URL}${dest}big-${file.filename}` ,
      })
      
      sharp(file.path)
      .resize(107,107)
      .toFile(`public/${dest}/small-${file.filename}` , (err , resizedImage) => {})

      .resize(458,458)
      .toFile(`public/${dest}/normal-${file.filename}` , (err , resizedImage) => {})

      .resize(1200,1200)
      .toFile(`public/${dest}/big-${file.filename}` , (err , resizedImage) => {})

    });
    thumbnails.shift()
    return thumbnails
  }

  public async postNewProduct(req:Request , res:Response , next:NextFunction){
    const {enName , fullName , type , price , desc , files } = req.body ,
    sellCount = 0

    //Processing Instruments
    const instrument = await new InstrumentModel().FindInstrument({enName : req.body.instrument}) , 
    category = await new CategoryModel().FindCategory({enName : req.body.category})

    
    const thumbnails = await this.thumbnailProccess(files)

    //Save
    await new ProductModel().CreateProduct({
      enName , fullName , type , price , desc , category , instrument , sellCount , thumbnails 
    })
    .then(result => {
      res.redirect('/dashboard/products')
    })
    .catch(err => {throw new Error(err)})
  }

}

import {Request , Response  , NextFunction} from 'express'
import Encrypt from '../../helpers/Encrypt'
import { AdminModel } from '../../models/admin'
import { CategoryModel } from '../../models/category'
import { InstrumentModel } from '../../models/instrument'
import { ProductModel } from '../../models/product'
import { RoleModel } from '../../models/roles'

import {requestFiles} from '../../helpers/interfaces'

export default new class dashboard_product {

  public async getProducts(req : Request , res:Response , next:NextFunction){
    const products = await ProductModel.find()
    res.render("dashboard/pages/products/getProducts" , {pageName : "محصولات" , products , layout : "dashboard/master_dashboard"})
  }

  
  public async getNewProduct(req:Request , res:Response , next:NextFunction){
    const instruments = await new InstrumentModel().Find({}) ,
    categories = await new CategoryModel().Find({})
    res.render("dashboard/pages/products/newProduct" , {instruments , categories , layout : "dashboard/master_dashboard"})
  }

  public async postNewProduct(req:Request , res:Response , next:NextFunction){
    const {enName , fullName , type , price , desc , category , instrument , files } = req.body ,
    sellCount = 0
    let thumbnails = [""]
    
    files.forEach((file : requestFiles) => {
      const dest = file.destination.replace("public/" , '/')
      thumbnails.push(`${dest}${file.filename}`)
    });
    thumbnails.shift()

    await new ProductModel().createProduct({
      enName , fullName , type , price , desc , category , instrument , sellCount , thumbnails 
    })
    .then(result => {
      res.redirect('/dashboard/products')
    })
    .catch(err => {throw new Error(err)})
  }

}
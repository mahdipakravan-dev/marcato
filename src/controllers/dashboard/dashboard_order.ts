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
import { OrderModel } from '../../models/order'

export default new class dashboard_order {

  constructor(){
    autoBind(this)
  }

  public async getOrders(req : Request , res:Response , next:NextFunction){
    /**
     * 1-populate to user
     */
    const orders = await OrderModel.find({}).populate("userId").sort({status : 1})
    res.render("dashboard/pages/orders/getOrders" , {pageName : "سفارشات" , orders , layout : "dashboard/master_dashboard"})
  }

}

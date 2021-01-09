import {Request , Response  , NextFunction} from 'express'
import Encrypt from '../../helpers/Encrypt'
import { AdminModel } from '../../models/admin'
import { RoleModel } from '../../models/roles'

export default new class dashboard_user {

  public async getAdmins(req : Request , res:Response , next:NextFunction){
    const admins = await AdminModel.find()
    res.render("dashboard/pages/admins/getAdmins" , {pageName : "لیست ادمین ها" , admins , layout : "dashboard/master_dashboard"})
  }

  public async editAdmin(req:Request , res:Response , next:NextFunction){
    !req.params.id ? res.redirect("dashboard/admins") : ""
    const admin = await AdminModel.findOne({_id : req.params.id})
    res.render("dashboard/pages/admins/editAdmin" , {pageName : "ویرایش ادمین" , admin , layout : "dashboard/master_dashboard"})
  }

  public async postEditAdmin(req:Request , res:Response , next : NextFunction){
    await AdminModel.updateOne({_id : req.params.id} , req.body)
    .then(result => {
      res.redirect(`/dashboard/admin/edit/${req.params.id}`)
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async getNewAdmin(req:Request , res:Response , next:NextFunction){
    const roles = RoleModel.find()
    res.render("dashboard/pages/admins/newAdmin" , {roles , layout : "dashboard/master_dashboard"})
  }

  public async postNewAdmin(req:Request , res:Response , next:NextFunction){
    req.body.password = await Encrypt.Hash(req.body.password)
    await new AdminModel().CreateAdmin(req.body)
    .then(result => {
      res.redirect("/dashboard/admins")
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async deleteAdmin(req:Request , res:Response , next:NextFunction){
    await AdminModel.deleteOne({_id : req.params.id})
    .then(result => {
      console.log("Result Of Deleting a Admin" , result)
      res.redirect("/dashboard/admins")
    })
  }

}
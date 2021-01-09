import {Request , Response  , NextFunction} from 'express'
import Encrypt from '../../helpers/Encrypt'
import { UserModel } from '../../models/user'

export default new class dashboard_user {

  public async getUsers(req : Request , res:Response , next:NextFunction){
    const users = await UserModel.find()
    res.render("dashboard/pages/users/getUsers" , {pageName : "لیست کاربران" , users , layout : "dashboard/master_dashboard"})
  }

  public async getUser(req:Request , res:Response , next:NextFunction){
    !req.params.id ? res.redirect("dashboard/users") : ""

    const user = await UserModel.findOne({_id : req.params.id})
    res.render("dashboard/pages/users/getUser" , {pageName : "ویرایش کاربر" , user , layout : "dashboard/master_dashboard"})
  }

  public async postEdit(req:Request , res:Response , next : NextFunction){
    
    await UserModel.updateOne({_id : req.params.id} , req.body)
    .then(result => {
      res.redirect(`/dashboard/user/${req.params.id}`)
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async getNewUser(req:Request , res:Response , next:NextFunction){
    res.render("dashboard/pages/users/newUser" , {layout : "dashboard/master_dashboard"})
  }

  public async postNewUser(req:Request , res:Response , next:NextFunction){
    req.body.password = await Encrypt.Hash(req.body.password)
    await new UserModel().CreateUser(req.body)
    .then(result => {
      res.redirect("/dashboard/users")
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async deleteUser(req:Request , res:Response , next:NextFunction){
    await UserModel.deleteOne({_id : req.params.id})
    .then(result => {
      console.log("Result Of Deleting a user" , result)
      res.redirect("/dashboard/users")
    })
  }

}
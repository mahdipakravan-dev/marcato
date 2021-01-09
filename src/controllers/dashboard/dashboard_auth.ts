import {Request , Response  , NextFunction} from 'express'
import Encrypt from '../../helpers/Encrypt'
import { DashboardToken } from '../../helpers/interfaces'
import Jwt from '../../helpers/jwt'
import { AdminModel } from '../../models/admin'
import { RoleModel } from '../../models/roles'

export default new class dashboard_auth {

  public async getLogin(req:Request , res:Response , next:NextFunction){
    if(req.cookies.dashboardToken) return res.render('dashboard/logout' , {layout : "master_none"})

    res.render("dashboard/login" , {layout : "master_none"})
  }

  public async postLogin(req:Request , res:Response , next:NextFunction){
    //Check Auth
    const {username , password} = req.body
    await AdminModel.findOne({username})
    .then(admin => {
      
      Encrypt.Compare(password,  admin!.password)
      .then(async result => {
        if(result) {
          const roles = await RoleModel.findOne({type : admin?.type})
          const token = Jwt.getToken<DashboardToken>({
            userType : admin!.type ,
            userName : `${admin!.name} ${admin!.lastName}` ,
            userProfile : admin!.profile ,
            roles : roles!.access
          })  
          res.cookie("dashboardToken" , token)
          res.redirect('/dashboard')
        } else {
          res.redirect('/dashboard/login')
        }
      })
      .catch(err => {
        //Redirect To Login
        res.redirect('/dashboard/login')
      })
    })
    .catch(err => {
      //Redirect To Login
      res.redirect('/dashboard/login')
    })
  }

  public async getLogout(req:Request , res:Response , next:NextFunction){
    res.clearCookie("dashboardToken")
    res.redirect("/dashboard/login")
  }

}
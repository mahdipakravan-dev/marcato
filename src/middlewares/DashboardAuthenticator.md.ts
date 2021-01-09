import { NextFunction , Request , Response } from "express";
import Jwt from "../helpers/jwt";
import config from 'config'

import { DashboardToken } from '../helpers/interfaces'

export default function(req:Request , res:Response , next:NextFunction){
  if(!req.cookies.dashboardToken) {
    return res.redirect('/dashboard/login')
  }
  else {
    const result = Jwt.authenticator(req!.cookies!.dashboardToken)
    req.app.locals.userType = result!.userData!.userType
    req.app.locals.userName = result!.userData!.userName
    req.app.locals.userProfile = result!.userData!.userProfile
    req.app.locals.sidebar = result!.userData!.roles

    req.app.locals.projectName = `${config.get("projectName")}` || "بدون نام"
    if(!req.app.locals.pageName) req.app.locals.pageName = "بدون عنوان"
    next()
  }
}
import { NextFunction, Request, Response } from "express"
import Jwt from "../helpers/jwt"

export default function (req:Request , res:Response , next:NextFunction){
  if(!req.cookies.dashboardToken) {
    return res.redirect("/maintance")
  }
  else {
    const token  = Jwt.authenticator(req.cookies.dashboardToken)
    req.token = token!.userData!.id
    next()
  }
}
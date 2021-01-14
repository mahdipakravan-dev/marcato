import { NextFunction , Request , Response } from "express";
import config from 'config'
import Jwt from "../helpers/jwt";
import { UserModel } from "../models/user";

export default async function(req:Request , res:Response , next:NextFunction){
  const user = Jwt.authenticator(req!.cookies!.frontendToken)
  req.app.locals.projectName = config.get("projectName") || "مارکاتو"
  req.app.locals.loggedIn = false

  if(req.cookies.frontendToken && user) {
    req.app.locals.loggedIn = true
    req.app.locals.auth = user.userData
  }


  req.app.locals.url = config.get("url")

  next()
}
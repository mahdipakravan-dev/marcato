import { NextFunction , Request , Response } from "express";
import Jwt from "../helpers/jwt";

export default function(req:Request , res:Response , next:NextFunction){
  if(!req.cookies.frontendToken) {
    return res.redirect('/user/login')
  }
  else {
    const token  = Jwt.authenticator(req.cookies.frontendToken)
    req.token = token!.userData!.id
    next()
  }
}
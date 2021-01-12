import { NextFunction , Request , Response } from "express";

export default function(req:Request , res:Response , next:NextFunction){
  if(!req.cookies.frontendToken) {
    return res.redirect('/user/login')
  }
  else {
    next()
  }
}
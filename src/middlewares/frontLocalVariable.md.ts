import { NextFunction , Request , Response } from "express";
import config from 'config'

export default function(req:Request , res:Response , next:NextFunction){
  req.app.locals.projectName = config.get("projectName") || "مارکاتو"

  next()
}
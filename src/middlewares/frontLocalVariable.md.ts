import { NextFunction , Request , Response } from "express";
import Jwt from "../helpers/jwt";
import config from 'config'

import { DashboardToken } from '../helpers/interfaces'

export default function(req:Request , res:Response , next:NextFunction){
  req.app.locals.projectName = config.get("projectName") || "مارکاتو"

  next()
}
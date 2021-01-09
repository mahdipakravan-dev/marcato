import { NextFunction , Request , Response } from "express";
const mkdirp = require('mkdirp')
import moment from 'moment'

export default function(req:Request , res:Response , next:NextFunction){
  const year = moment().format('YYYY') ,
    month = moment().format('M') ,
    dir = `./public/uploads/${year}/${month}/`
  mkdirp.sync(dir)
  req.body.files = req.files
  next()
}
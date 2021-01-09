import {Request , Response , NextFunction} from 'express'
export default function fileToBody(req:Request,res:Response,next:NextFunction){
    req.body.files = req.files
    next()
}
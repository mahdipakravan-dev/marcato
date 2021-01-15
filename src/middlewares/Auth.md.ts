import { Request, Response, NextFunction } from "express";
import HttpException from "../helpers/Exception";
import Jwt from '../helpers/jwt'
import { statusCodes } from "../helpers/interfaces";

export default function AuthHandler(req: Request, res: Response, next: NextFunction): void {
    let token = Jwt.authenticator(req.header("token")?.toString() || "")
    if (!token || !token.userData) res.status(403)
    else req.auth = token.userData
    next()
}
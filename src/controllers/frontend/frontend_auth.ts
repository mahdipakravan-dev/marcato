import { Request, Response, NextFunction } from "express";
import Encrypt from "../../helpers/Encrypt";
import { FrontendToken, statusCodes } from "../../helpers/interfaces";
import Jwt from "../../helpers/jwt";
import HttpResponse from "../../helpers/Response";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_auth {

    public async postLogin(req: Request, res: Response, next: NextFunction) {
        const {phone , password } = req.body
        const user = await new UserModel().FindUser({phone})
        
        if(!user) return res.send("کاربر دیگری با این شماره تلفن وجود دارد")

        await Encrypt.Compare(password , user!.password)
        .then(result => {
          const token = Jwt.getToken<FrontendToken>({
            phone
          })  
          res.cookie("frontendToken" , token)
          res.redirect('/user')
        })
        .catch(err => {throw new Error(err)})
    }

    public async postRegister(req: Request, res: Response, next: NextFunction) {
      let {password , phone } = req.body

      //Hash Password
      password = await Encrypt.Hash(req.body.password)

      //Check Conflict For username
      const user = await new UserModel().FindUser({phone})
      if(user) return res.send("کاربر دیگری با این شماره تلفن وجود دارد")
      
      await new UserModel().CreateUser({
        phone : req.body.phone ,
        password
      })
      .then(() => {
        //Create Session Or Cookie For Here
        const token = Jwt.getToken<FrontendToken>({
          phone
        })  
        res.cookie("frontendToken" , token)
        res.redirect("/user")
      })
      .catch(err => {
        throw new Error(err)
      })
    }

    public async getLogin(req: Request, res: Response, next: NextFunction) {
      res.render("frontend/login")
    }

    public async getLogout(req:Request,  res:Response , next:NextFunction) {
      res.clearCookie("frontendToken")
      res.redirect("/user/login")
    }

}
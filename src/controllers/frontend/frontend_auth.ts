import { Request, Response, NextFunction } from "express";
import Encrypt from "../../helpers/Encrypt";
import { FrontendToken, statusCodes } from "../../helpers/interfaces";
import Jwt from "../../helpers/jwt";
import Regex from "../../helpers/Regex";
import HttpResponse from "../../helpers/Response";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_auth {

    public async postLogin(req: Request, res: Response, next: NextFunction) {
      const {phone , password , redirectTo } = req.body
      const user = await new UserModel().FindUser({phone : Regex.phoneNumber(phone)})
      console.log(redirectTo)
      
      if(!user) {
        req.flash("errors" , ["نام کاربری یا رمز عبور شما اشتباه است"])
        res.redirect('/user/login')
      }

      await Encrypt.Compare(password , user!.password)
      .then(result => {
        const token = Jwt.getToken<FrontendToken>({
          phone ,
          id : user._id
        })  
        res.cookie("frontendToken" , token)
        res.redirect(redirectTo)
      })
      .catch(err => {throw new Error(err)})
    }

    public async postRegister(req: Request, res: Response, next: NextFunction) {
      let {password , phone , name , family , instrument , redirectTo } = req.body

      //Hash Password & Regex phone
      password = await Encrypt.Hash(req.body.password)
      phone = Regex.phoneNumber(phone)

      //Check Conflict For username
      const user = await new UserModel().FindUser({phone})
      if(user) {
        req.flash("errors" , ["کاربر دیگری با این شماره تلفن وجود دارد"])
        res.redirect('/user/login')
      }
      
      await new UserModel().CreateUser({
        phone ,
        password , 
        name , 
        family , 
        instrument
      })
      .then(result => {
        //Create Session Or Cookie For Here
        const token = Jwt.getToken<FrontendToken>({
          phone ,
          id : result._id
        })  
        res.cookie("frontendToken" , token)
        res.redirect(redirectTo)
      })
      .catch(err => {
        res.send("مشکلی پیش آمده مجددا تلاش نمایید").status(statusCodes.INTERNAL)
      })
    }

    public async getLogin(req: Request, res: Response, next: NextFunction) {
      const redirectTo = req.query.back || "/user"
      res.render("frontend/login" , {redirectTo})
    }

    public async getLogout(req:Request,  res:Response , next:NextFunction) {
      res.clearCookie("frontendToken")
      res.redirect("/user/login")
    }

}
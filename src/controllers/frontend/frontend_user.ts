import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../../models/order";
import { ProductModel } from "../../models/product";
import { UserModel } from "../../models/user";

export default new class frontend_user {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.token , 
        user = await new UserModel().FindUser({_id : userId}) ,
        orders = await new OrderModel().FindOrders({userId})
        res.render('frontend/pages/user/user' , {orders , user})
    }

    public async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.token , 
        orderId = req.params.id ,
        user = await new UserModel().FindUser({_id : userId}) ,
        order = await new OrderModel().FindOrder({_id : orderId})
        res.render('frontend/pages/user/getOrder' , {order , user , layout : "master_none"})
    }

    public async postEdit(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.token
        await new UserModel().EditUser({_id : userId} , req.body)
        .then(() => {
            req.flash("success" , "تغییر اطلاعات کاربری با موفقیت انجام شد")
            res.redirect("/user")
        })
        .catch(err => {
            req.flash("error" , "مشکلی پیش آمده , مقادیر را بررسی و مجددا تلاش کنید")
            res.redirect('/user')
        })
    }

}
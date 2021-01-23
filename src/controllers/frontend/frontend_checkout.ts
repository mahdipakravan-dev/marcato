import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../../models/order";
import { PaymentModel } from "../../models/payment";
import { ProductModel } from "../../models/product";

import superagent from "superagent"
import config from "config";
import { statusCodes } from "../../helpers/interfaces";
import PaymentHelper from "../../helpers/Payment";

export default new class frontend_checkout {

    public async getCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.render('frontend/checkout')
    }

    public async postCheckout(req: Request, res: Response, next: NextFunction){
        const {rFullName , rPhoneNumber , rAddress , rPostalCode , rNote = "" } = req.body

        const order = await new OrderModel().FindOrderAndUpdate({userId : req.token , status : "pending"} , {
            rFullName , rPhoneNumber , rAddress , rPostalCode , rNote
        })
        const payment = await new PaymentModel().CreatePayment(order.id , {
            orderId : order._id , 
            amount : order.finalPrice , 
            factorNumber : order._id ,
        })
        
        if(!order && !payment) return res.json({}).status(statusCodes.NOT_FOUND)

        PaymentHelper.Request_GetToken(order.finalPrice , order._id)
        .then(async (result : any) => {

            if(result.status != 1) {throw new Error("مشکلی پیش آمده")}
            await new PaymentModel().UpdatePayment({_id : payment._id , internalStatus : 1} , {internalStatus : 2 , token : result.token})
            .then(() => {
                res.redirect(`${config.get("vandar.redirectUrl")}${result.token}`)
            })
            .catch(err => {
                PaymentHelper.StartAgain(payment._id , req,res)
            })
        })
        .catch(() => {PaymentHelper.StartAgain(payment._id , req,res)})
    }

    public async getCallback(req:Request , res:Response , next:NextFunction){
        const {token , payment_status} = req.query as {token : string , payment_status : string}
        await new PaymentModel().UpdatePayment({token} , {internalStatus : 3 , message : payment_status})

        if(payment_status != "OK") return PaymentHelper.Failed("تراکنش از طرف کاربر کنسل شد" , token , res)

        /**
         * Transaction Validation
         */
        PaymentHelper.Request_Transaction(token)
        .then((transactionResult : any)=> {
            console.log("Transaction Result" , transactionResult)
            if(transactionResult.status == 0 ) return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید", token , res)
            

            /**
             * Verify Validation
             */
            PaymentHelper.Request_Verify(token)
            .then((verifyResult : any) => {               
                console.log("Verify Result" , verifyResult) 
                if(verifyResult.status == 0) {return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید" , token , res)}
                           
                PaymentHelper.Success("از الان میتوانید از طریق پنل وضعیت سفارش خود را پیگیری کنید" , token , transactionResult , res)
            })

            /**
             * Handle Catch
             */
            .catch(() => PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید" , token , res))
        })
        .catch(() => PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید", token , res))
    }

}
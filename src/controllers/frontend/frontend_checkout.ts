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
            .then(updateResult => {
                res.redirect(`${config.get("vandar.redirectUrl")}${result.token}`)
            })
            .catch(err => {
                PaymentHelper.StartAgain(payment._id , req,res)
            })
        })
        .catch(() => {PaymentHelper.StartAgain(payment._id , req,res)})

        // superagent
        // .post("https://ipg.vandar.io/api/v3/send")
        // .set('Accept' , 'application/json')
        // .set('Content-Type' , 'application/json')
        // .send({
        //     api_key : config.get('vandar.api_key') ,
        //     amount : order.finalPrice , 
        //     factorNumber : order._id , 
        //     description : payment._id , 
        //     callback_url : `${process.env.URL}${config.get("payment.callbackUrl")}`
        // })
        // .end(async (err , result) => {
        //     if(err) {
        //         console.log(err)
        //         await new PaymentModel().UpdatePayment({_id : payment._id} , {internalStatus : 4})
        //         throw new Error("ظاهرا مشکلی سمت سرور درگاه پیش آمده مجددا تلاش کنید یا با پشتیبانی تماس حاصل کنید")
        //     }
        //     const sendResult = JSON.parse(result.text)

        //     if(result.status != 200 && sendResult.status != 1) {throw new Error("مشکلی پیش آمده")}
        //     await new PaymentModel().UpdatePayment({_id : payment._id , internalStatus : 1} , {internalStatus : 2 , token : sendResult.token})
        //     .then(result => {
        //         res.redirect(`${config.get("vandar.redirectUrl")}${sendResult.token}`)
        //     })
        //     .catch(err => {
        //         throw new Error("مشکلی پیش آمده")    
        //     })
        // })
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

        // superagent
        // .post(config.get("vandar.transactionUrl"))
        // .set('Accept' , 'application/json')
        // .set('Content-Type' , 'application/json')
        // .send({
        //     api_key : config.get("vandar.api_key") , 
        //     token
        // })
        // .end(async(err,result) => {
        //     if(err) return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید", token , res)
            
        //     const transactionResult = JSON.parse(result.text)
        //     if(transactionResult.status == 0 ) return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید", token , res)
        //     /**
        //      * Verify Transaction
        //      */
        //     superagent
        //     .post(config.get("vandar.verifyUrl"))
        //     .set('Accept' , 'application/json')
        //     .set('Content-Type' , 'application/json')
        //     .send({
        //         api_key : config.get("vandar.api_key") , 
        //         token
        //     })
        //     .end(async (verifyError , verifyResult) => {
        //         if(verifyError) {return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید" , token , res)}
                
        //         const verify = JSON.parse(verifyResult.text)
        //         if(verifyResult.status == 0) {return PaymentHelper.Failed("در تایید تراکنش شما خطایی رخ داده است , اگر تا 12 ساعت دیگر به حساب شما برنگشت با پشتیبانی تماس بگیرید" , token , res)}
        //         PaymentHelper.Success("از الان میتوانید از طریق پنل وضعیت سفارش خود را پیگیری کنید" , token , transactionResult , res)
        //     })
        // })
    }

    public async getCheckoutResult(req:Request , res:Response , next:NextFunction){
        // console.log(req.flash("errors") , console.log(req.flash("message")))
        // if(!req.flash('errors') || !req.flash("message")) return req.flash("errors" , "ظاهرا مشکلی پیش آمده..."); res.redirect("/")
        res.render('frontend/checkout-result' , {layout : "master_none" , errors : req.flash("errors") , message : req.flash("message")})
    }

}
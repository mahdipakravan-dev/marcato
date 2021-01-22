import { Request, Response, NextFunction } from "express";
import { OrderModel } from "../../models/order";
import { PaymentModel } from "../../models/payment";
import { ProductModel } from "../../models/product";

import superagent from "superagent"
import config from "config";
import { statusCodes } from "../../helpers/interfaces";

export default new class frontend_checkout {

    public async getCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.render('frontend/checkout')
    }

    public async postCheckout(req: Request, res: Response, next: NextFunction){
        const order = await new OrderModel().FindOrder({userId : req.token , status : "pending"})
        const payment = await new PaymentModel().CreatePayment(order.id , {
            orderId : order._id , 
            amount : order.finalPrice , 
            factorNumber : order._id ,
        })
        
        if(!order && !payment) return res.json({}).status(statusCodes.NOT_FOUND)

        superagent
        .post("https://ipg.vandar.io/api/v3/send")
        .set('Accept' , 'application/json')
        .set('Content-Type' , 'application/json')
        .send({
            api_key : config.get('vandar.api_key') ,
            amount : order.finalPrice , 
            factorNumber : order._id , 
            description : payment._id , 
            callback_url : `${process.env.URL}${config.get("payment.callbackUrl")}`
        })
        .end(async (err , result) => {
            if(err) {
                await new PaymentModel().UpdatePayment({_id : payment._id} , {internalStatus : 4})
                throw new Error("ظاهرا مشکلی سمت سرور درگاه پیش آمده مجددا تلاش کنید یا با پشتیبانی تماس حاصل کنید")
            }
            const sendResult = JSON.parse(result.text)

            if(result.status == 200 && sendResult.status == 1) {
                await new PaymentModel().UpdatePayment({_id : payment._id , internalStatus : 1} , {internalStatus : 2 , token : sendResult.token})
                res.redirect(`${config.get("vandar.redirectUrl")}${sendResult.token}`)
            } else {
                throw new Error("مشکلی پیش آمده")
            }
        })
    }

    public async getCallback(req:Request , res:Response , next:NextFunction){
        const {token , payment_status} = req.query
        await new PaymentModel().UpdatePayment({token} , {internalStatus : 3 , message : payment_status})

        if(payment_status == "OK") {
            superagent
            .post(config.get("vandar.transactionUrl"))
            .set('Accept' , 'application/json')
            .set('Content-Type' , 'application/json')
            .send({
                api_key : config.get("vandar.api_key") , 
                token
            })
            .end(async(err,result) => {
                if(err) throw new Error("مشکلی پیش آمده است , با پشتیبانی تماس حاصل کنید")
                console.log("TransactionResult" , result.text)
                const sendResult = JSON.parse(result.text)
                if(sendResult.status == 0) {
                    req.flash("errors" , sendResult.errors)
                    return res.redirect("/checkout_result")
                }
                
                /**
                 * Verify Transaction
                 */
                superagent
                .post(config.get("vandar.verifyUrl"))
                .set('Accept' , 'application/json')
                .set('Content-Type' , 'application/json')
                .send({
                    api_key : config.get("vandar.api_key") , 
                    token
                })
                .end(async (verifyError , verifyResult) => {
                    console.log("VerifyResult" , verifyResult)
                    if(verifyError) {
                        req.flash("errors" , sendResult.errors)
                        return res.redirect("/checkout_result")
                    }
                    await new PaymentModel().UpdatePayment({token} , sendResult)
                    req.flash("message" , ['',`پرداخت شما با موفقیت انجام شد , کد رهگیری : ${sendResult.transId}`])
                    res.redirect('/checkout_result')
                })
            })
            //1-Send Verify Request
            //2-Store Result + Change orderStatus
            //3-
        } else {
            req.flash("errors" , ["تراکنش از طرف شما کنسل شده است"]);
            return res.redirect("/checkout_result")
        }
    }

    public async getCheckoutResult(req:Request , res:Response , next:NextFunction){
        // console.log(req.flash("errors") , console.log(req.flash("message")))
        // if(!req.flash('errors') || !req.flash("message")) return req.flash("errors" , "ظاهرا مشکلی پیش آمده..."); res.redirect("/")
        res.render('frontend/checkout-result' , {layout : "master_none" , errors : req.flash("errors") , message : req.flash("message")})
    }

}
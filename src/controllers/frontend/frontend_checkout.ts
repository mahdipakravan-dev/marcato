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
                console.log(err)
                await new PaymentModel().UpdatePayment({_id : payment._id} , {internalStatus : 4})
                throw new Error("ظاهرا مشکلی سمت سرور درگاه پیش آمده مجددا تلاش کنید یا با پشتیبانی تماس حاصل کنید")
            }
            const sendResult = JSON.parse(result.text)

            if(result.status == 200 && sendResult.status == 1) {
                await new PaymentModel().UpdatePayment({_id : payment._id , internalStatus : 1} , {internalStatus : 2 , token : sendResult.token})
                .then(result => {
                    res.redirect(`${config.get("vandar.redirectUrl")}${sendResult.token}`)
                })
                .catch(err => {
                    throw new Error("مشکلی پیش آمده")    
                })
            } else {
                throw new Error("مشکلی پیش آمده")
            }
        })
    }

    public async getCallback(req:Request , res:Response , next:NextFunction){
        const {token , payment_status} = req.query as {token : string , payment_status : string}
        await new PaymentModel().UpdatePayment({token} , {internalStatus : 3 , message : payment_status})

        if(payment_status == "OK") {
            
            /**
             * Transaction
             */

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

                const transactionResult = JSON.parse(result.text)

                if(transactionResult.status == 0) {
                    await new PaymentModel().DeletePayment({token})
                    req.flash("errors" , transactionResult.errors)
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
                    if(verifyError) {
                        console.log("Verify Problem" , verifyError)
                        await new PaymentModel().DeletePayment({token})
                        req.flash("warning" , ["x" , "a"]) // This is Just a fake argument for flash
                        return res.redirect("/checkout_result")
                    }

                    await new PaymentModel().PaymentSuccess(token , transactionResult)
                    // await new OrderModel().UpdateOrder({orderId : })
                    req.flash("message" , [`پرداخت شما با موفقیت انجام شد , کد رهگیری : ${transactionResult.transId}`])
                    res.redirect('/checkout_result')
                })
            })
            //1-Send Verify Request
            //2-Store Result + Change orderStatus
            //3-
        } else {
            await new PaymentModel().DeletePayment({token})
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
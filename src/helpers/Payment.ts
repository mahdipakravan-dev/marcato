import autoBind from "auto-bind";
import { PaymentModel } from "../models/payment";
import {Response , Request} from 'express'
import superagent from "superagent";
import config from "config";
import { getTokenInterface, transactionResultInterface, verifyResultInterface } from "./interfaces";

export default new class PaymentHelper {

  constructor(){
    autoBind(this)
  }

  async Request_GetToken(amount : number , factorNumber : string) : Promise<any>{
    return new Promise((resolve , reject) => {
      superagent
        .post("https://ipg.vandar.io/api/v3/send")
        .set('Accept' , 'application/json')
        .set('Content-Type' , 'application/json')
        .send({
            api_key : config.get('vandar.api_key') ,
            amount , 
            factorNumber , 
            callback_url : `${process.env.URL}${config.get("payment.callbackUrl")}`
        })
        .end((err , result) => {
          if(err) return reject(err)
          resolve(JSON.parse(result.text) as getTokenInterface)
        })
    })
  }

  async Request_Transaction(token:string){
    return new Promise((resolve , reject) => {
      superagent
      .post(config.get("vandar.transactionUrl"))
      .set('Accept' , 'application/json')
      .set('Content-Type' , 'application/json')
      .send({
          api_key : config.get("vandar.api_key") , 
          token
      })
      .end(async(err,result) => {
          if(err) return reject(err)
          resolve(JSON.parse(result.text) as transactionResultInterface)
      })
    })
  }

  async Request_Verify(token:string) : Promise<any>{
    return new Promise((resolve , reject) => {
      superagent
      .post(config.get("vandar.verifyUrl"))
      .set('Accept' , 'application/json')
      .set('Content-Type' , 'application/json')
      .send({
          api_key : config.get("vandar.api_key") , 
          token
      })
      .end(async (verifyError , verifyResult) => {
        if(verifyError) return reject(verifyError)
        resolve(JSON.parse(verifyResult.text) as verifyResultInterface)
      })
    })
  }

  async Failed(error : string , token : string , res : Response){
    await new PaymentModel().DeletePayment({token})
    .then(() => res.render("frontend/checkout-result" , {layout : "master_none" , error , success : ""}))
    .catch(() => {throw new Error("مشکلی پیش آمده با پشتیبانی تماس حاصل کنید")})
  }

  async Success(success : string = "از الان میتوانید از طریق پنل درخواست خود را پیگیری کنید" , token : string , transactionResult : any , res:Response) {
    await new PaymentModel().PaymentSuccess(token , transactionResult)
    .then(() => res.render('frontend/checkout-result' , {layout : "master_none" , error : "" , success}))
    .catch(() => {throw new Error("مشکلی پیش آمده با پشتیبانی تماس حاصل کنید")})
  }

  async StartAgain(paymentId : string , req:Request , res:Response){
    await new PaymentModel().UpdatePayment({_id : paymentId} , {internalStatus : 4})
    req.flash("errors" , ['لطفا مجددا تلاش نمایید'])
    res.redirect("/checkout")
  }

}
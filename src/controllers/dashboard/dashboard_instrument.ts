
import {Request , Response  , NextFunction} from 'express'
import { InstrumentModel } from '../../models/instrument'

export default new class dashboard_instrument {

  public async getInstruments(req : Request , res:Response , next:NextFunction){
    // (GET) Render Instruments
    const instruments = await new InstrumentModel().Find({})
    res.render("dashboard/pages/products/instrument/instruments" , {pageName : "سازها" , instruments , layout : "dashboard/master_dashboard"})
  }

  public async getNewInstrument(req : Request , res:Response , next:NextFunction){
    // (GET) Render 'newInstrument' Page
    res.render("dashboard/pages/products/instrument/newInstrument" , {pageName : "ساز جدید" , layout : "dashboard/master_dashboard"})
  }

  public async postNewInstrument(req : Request , res:Response , next:NextFunction){
    // (POST) Save New Instrument To Database
    await new InstrumentModel().CreateInstrument(req.body)
    .then(() => {
      res.redirect('/dashboard/product/instruments')
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async getEditInstrument(req : Request , res:Response , next:NextFunction){
    const instrument = await new InstrumentModel().FindInstrument(req.params.id)
    res.render('dashboard/pages/products/instrument/editInstrument' , {instrument , layout : "dashboard/master_dashboard"})
  }

  public async postEditInstrument(req : Request , res:Response , next:NextFunction){
    await new InstrumentModel().EditInstrument(req.params.id , req.body)
    .then(() => {res.redirect('/dashboard/product/instruments')})
    .catch(err => {throw new Error(err)})
  }

  public async deleteInstrument(req:Request , res:Response , next : NextFunction){
    await new InstrumentModel().DeleteInstrument(req.params.id)
    .then(() => {res.redirect("/dashboard/product/instruments")})
    .catch((err) => {throw new Error(err)})
  }

}
  
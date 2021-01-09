import {Request , Response  , NextFunction} from 'express'

export default new class dashboard_controller {

  public async getDashboard(req : Request , res:Response , next:NextFunction){
    // Check Token
    // Authorize JWT Token
    // If(Not Registered) : dashboard_auth.getLogin
    // else dashboard_controller.getDashboard
    // res.cookie("dashboardToken" , "This is Your Dashboard Token")
    // console.log(req.cookies)
    // console.log(req.session)
   res.render("dashboard/index" , {pageName : "داشبورد" , layout : "dashboard/master_dashboard"})
  }

}
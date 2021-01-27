import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class HomeController {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const newProducts = await new ProductModel().Sort({} , {created_at : -1} , 10) , 
        topProducts = await new ProductModel().Sort({} , {sellCount : -1} , 10) , 
        newGuitars = await new ProductModel().Find({'instrument.enName' : 'guitar'}) , 
        newKalimbas = await new ProductModel().Find({'instrument.enName' : 'kalimba'})
        res.render('home' , {newProducts , topProducts , newGuitars , newKalimbas})
    }

}
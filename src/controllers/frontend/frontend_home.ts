import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class HomeController {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const newProducts = await new ProductModel().Find({}) , 
        topProducts = await new ProductModel().Find({}) , 
        newGuitars = await new ProductModel().Find({}) , 
        newKalimbas = await new ProductModel().Find({})
        res.render('home' , {newProducts , topProducts , newGuitars , newKalimbas})
    }

}
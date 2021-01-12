import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class HomeController {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        const products = await new ProductModel().Find({})
        res.render('home' , {products})
    }

}
import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class frontend_cart {

    public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const products = await new ProductModel().Find({})
        res.render('frontend/cart')
    }

    public async addCart(req: Request, res: Response, next: NextFunction): Promise<void> {
      const products = await new ProductModel().Find({})
      res.render('frontend/cart')
    }

}
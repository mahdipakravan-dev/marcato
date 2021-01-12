import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class frontend_product {

    public async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
      const product = await new ProductModel().FindProduct({_id : req.params.id})
      // sameProducts = await new ProductModel().Find()
      res.render('frontend/product-physic' , {product : product})
    }

}
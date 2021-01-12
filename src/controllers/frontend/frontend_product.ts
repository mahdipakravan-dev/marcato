import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class frontend_product {

    public async getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
      const product = await new ProductModel().FindProduct({_id : req.params.id}) , 
      // Bellow Query : (!= this product) (instrument OR Category == this product) (limit : 4)
      sameProducts = await new ProductModel().Sort(
        {$and : [
          {category : product.category} , {fullName : {$ne : product.fullName}}
        ]},
        {'date':-1},
        4)
        
      res.render('frontend/product-physic' , {product , sameProducts})
    }

}
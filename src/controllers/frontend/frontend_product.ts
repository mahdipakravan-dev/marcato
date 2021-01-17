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

    public async getProducts(req:Request , res:Response , next:NextFunction) {
      const {page = 1} = req.query ,
      products = await new ProductModel().Paginate({
        query : {},
        sort: { price : -1 },
        limit: 12 ,
        page
      })
      res.render("frontend/products" , {products})
    }

    public async getProductsCat(req:Request , res:Response , next:NextFunction) {
      const {page = 1} = req.query ,
      {category} = req.params ,
      products = await new ProductModel().Paginate({
        query : {'category.enName' : category},
        sort: { price : -1 },
        limit: 12 ,
        page
      })
      res.render("frontend/products" , {products})
    }

    public async getProductsIns(req:Request , res:Response , next:NextFunction) {
      const {page = 1} = req.query ,
      {instrument} = req.params ,
      products = await new ProductModel().Paginate({
        query : {'instrument.enName' : instrument},
        sort: { price : -1 },
        limit: 12 ,
        page
      })
      res.render("frontend/products" , {products})
    }

}
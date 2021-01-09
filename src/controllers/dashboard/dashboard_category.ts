
import {Request , Response  , NextFunction} from 'express'
import { CategoryModel } from '../../models/category'

export default new class dashboard_category {

  public async getCategories(req : Request , res:Response , next:NextFunction){
    // (GET) Render Categorys
    const categories = await new CategoryModel().Find({})
    res.render("dashboard/pages/products/category/categories" , {pageName : "دسته بندی ها" , categories , layout : "dashboard/master_dashboard"})
  }

  public async getNewCategory(req : Request , res:Response , next:NextFunction){
    // (GET) Render 'newCategory' Page
    res.render("dashboard/pages/products/Category/newCategory" , {pageName : "دسته بندی جدید" , layout : "dashboard/master_dashboard"})
  }

  public async postNewCategory(req : Request , res:Response , next:NextFunction){
    // (POST) Save New Category To Database
    await new CategoryModel().CreateCategory(req.body)
    .then(() => {
      res.redirect('/dashboard/product/categories')
    })
    .catch(err => {
      throw new Error(err)
    })
  }

  public async getEditCategory(req : Request , res:Response , next:NextFunction){
    const category = await new CategoryModel().FindCategory(req.params.id)
    res.render('dashboard/pages/products/category/editCategory' , {category , layout : "dashboard/master_dashboard"})
  }

  public async postEditCategory(req : Request , res:Response , next:NextFunction){
    await new CategoryModel().EditCategory(req.params.id , req.body)
    .then(() => {res.redirect('/dashboard/product/categories')})
    .catch(err => {throw new Error(err)})
  }

  public async deleteCategory(req:Request , res:Response , next : NextFunction){
    await new CategoryModel().DeleteCategory(req.params.id)
    .then(() => {res.redirect("/dashboard/product/categories")})
    .catch((err) => {throw new Error(err)})
  }

}
  
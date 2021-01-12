import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../models/product";

export default new class frontend_user {

    public async getHome(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.render('frontend/user')
    }

}
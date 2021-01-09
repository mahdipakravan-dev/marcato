import express = require('express')
import multer from "multer"

import dashboard_admin from '../controllers/dashboard/dashboard_admin'
import dashboard_auth from '../controllers/dashboard/dashboard_auth'
import dashboard_controller from '../controllers/dashboard/dashboard_controller'
import dashboard_product from '../controllers/dashboard/dashboard_product'
import dashboard_subcategory from '../controllers/dashboard/dashboard_category'
import dashboard_users from '../controllers/dashboard/dashboard_user'
import dashboard_instrument from '../controllers/dashboard/dashboard_instrument'
import { MulterConfig , FileFilter} from '../configurations/multer'

import DashboardAuthenticator from '../middlewares/DashboardAuthenticator.md'
import checkUploadPathMd from '../middlewares/checkUploadPath.md'
import fileToBodyMd from '../middlewares/fileToBody.md'

const Router = express.Router() ,
upload = multer({storage: multer.diskStorage(MulterConfig), fileFilter : FileFilter});

Router.get('/login' , dashboard_auth.getLogin)
Router.post("/login" , dashboard_auth.postLogin)

Router.use(DashboardAuthenticator)

Router.get("/logout" , dashboard_auth.getLogout)
Router.get('/' , dashboard_controller.getDashboard)


Router.get('/users' , dashboard_users.getUsers)
Router.get("/user/insert" , dashboard_users.getNewUser)
Router.post("/newUser" , dashboard_users.postNewUser)
Router.get("/user/:id" , dashboard_users.getUser)
Router.post("/user/edit/:id" , dashboard_users.postEdit)
Router.get("/user/delete/:id" , dashboard_users.deleteUser)

Router.get("/admins" , dashboard_admin.getAdmins)
Router.get("/admin/edit/:id" , dashboard_admin.editAdmin)
Router.post("/admin/edit/:id" , dashboard_admin.postEditAdmin)
Router.get("/admin/insert" , dashboard_admin.getNewAdmin)
Router.post("/admin/insert" , dashboard_admin.postNewAdmin)
Router.get("/admin/delete/:id" , dashboard_admin.deleteAdmin)

/**
 * Products
 */

Router.get("/products" , dashboard_product.getProducts)
Router.get("/product/insert" , dashboard_product.getNewProduct)
Router.post("/product/insert" , checkUploadPathMd , upload.array('gallery',5) , fileToBodyMd , dashboard_product.postNewProduct)

// Category
Router.get("/product/categories" , dashboard_subcategory.getCategories)
Router.get("/product/category/insert" , dashboard_subcategory.getNewCategory)
Router.post("/product/category/insert" , dashboard_subcategory.postNewCategory)
Router.get("/product/category/edit/:id" , dashboard_subcategory.getEditCategory)
Router.post("/product/category/edit/:id" , dashboard_subcategory.postEditCategory)
Router.get("/product/category/delete/:id" , dashboard_subcategory.deleteCategory)
// Instrument
Router.get("/product/instruments" , dashboard_instrument.getInstruments)
Router.get("/product/instrument/insert" , dashboard_instrument.getNewInstrument)
Router.post("/product/instrument/insert" , dashboard_instrument.postNewInstrument)
Router.get("/product/instrument/edit/:id" , dashboard_instrument.getEditInstrument)
Router.post("/product/instrument/edit/:id" , dashboard_instrument.postEditInstrument)
Router.get("/product/instrument/delete/:id" , dashboard_instrument.deleteInstrument)

/**
 * End Products
 */

export default Router
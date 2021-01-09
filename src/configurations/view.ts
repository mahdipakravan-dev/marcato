import express , { Application } from "express";
import expressLayouts from "express-ejs-layouts"

export default class ViewConfig{
    constructor(private readonly app:Application){ 
        app.set("view engine" , "ejs")
        app.set("views" , 'public/views')
        app.use(express.static("public"));
        app.use(expressLayouts)
        app.set("layout" , "frontend/master_frontend")
        app.set("layout extractScripts",true)
        app.set("layout extractStyles", true)


        console.log(`Views Directory is : ${app.get("views")}`)
    }
}
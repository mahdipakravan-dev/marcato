import mongoose from 'mongoose'

import config from 'config'

export default class ConnectMongo{
    constructor(){
        console.log("Mongo Want To Connect To : " , <string>process.env.MONGOHOST)
        mongoose.connect( <string>process.env.MONGOHOST , config.get('mongoConfig') , (err) => {
            console.log("Err To Connect Mongo" , err)
        })
    }
}
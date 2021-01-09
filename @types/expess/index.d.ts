import * as express from "express"
import { requestFiles } from "../../src/helpers/interfaces";

declare global {
    namespace Express {
        interface Request {
            token: string
            auth: { userId: string } 
            session : any 
        }

    }
}


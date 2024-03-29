import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../helpers/Exception';
import { statusCodes } from '../helpers/interfaces';
import HttpResponse from '../helpers/Response';

function validationMiddleware<T>(type: any): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        validate(plainToClass(type, req.body))
            .then((errors: ValidationError[]) => {
                console.log(errors)
                if (errors.length > 0) {
                    let messages: string[] = []
                    errors.forEach((error: ValidationError) => {
                        messages.push(Object.values(error.constraints || "")[0])
                    })
                    next(new HttpResponse(res, statusCodes.VALIDATION_ERROR, messages))
                } else {
                    console.log("Next")
                    next();
                }
            });
    };
}

export default validationMiddleware;
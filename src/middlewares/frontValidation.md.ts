import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../helpers/Exception';
import { statusCodes } from '../helpers/interfaces';
import HttpResponse from '../helpers/Response';

export default function frontValidationMiddleware<T>(type: any , redirectTo : string): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        validate(plainToClass(type, req.body))
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    let messages: string[] = []
                    errors.forEach((error: ValidationError) => {
                        messages.push(Object.values(error.constraints || "")[0])
                    })
                    req.flash("errors" , messages)
                    res.redirect(redirectTo)
                    // next(new HttpResponse(res, statusCodes.VALIDATION_ERROR, messages))
                } else {
                    next();
                }
            });
    };
}
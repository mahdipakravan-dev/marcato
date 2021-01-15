
class HttpException extends Error {
    constructor(public status: number, public error: any = "", public json: {} = {}) {
        super(error);
    }
}

export default HttpException;
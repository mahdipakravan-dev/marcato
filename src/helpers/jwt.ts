import * as jwt from 'jsonwebtoken'
import config from 'config'

export default class Jwt {
    static getToken<IToken>(payload: IToken): string {
        return jwt.sign({
            userData : payload
        }, config.get('jwtSign'), { expiresIn: "1d" })
    }

    static authenticator(token: string){
        return jwt.decode(token, config.get('jwtSign'))
    }
}
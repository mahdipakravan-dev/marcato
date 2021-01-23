import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
export default class UserEditDto {

    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    @Length(10 , 11 , {message : "شماره تلفن باید  11 رقم باشد , برای مثال 09303076784"})
    public phone!: string;

    @IsEmail({} , {message : "ایمیل شما معتبر نمیباشد"})
    public mail!: string;

    public redirectTo : string = "/user"
}
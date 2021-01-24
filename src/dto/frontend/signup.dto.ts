import { IsNumber, IsString, Length } from 'class-validator';
export default class SignUpDto {
    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    @Length(10 , 11 , {message : "شماره تلفن باید  11 رقم باشد , برای مثال 09303076784"})
    public phone!: string;

    @IsString({ message : "لطفا رمز عبور خود را وارد نمایید" })
    public password!: string;
}
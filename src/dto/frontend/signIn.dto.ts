import { IsString, Length } from 'class-validator';
export default class SignUpDto {
    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    public phone!: string;

    @IsString({ message : "لطفا رمز عبور خود را وارد نمایید" })
    @Length(6 , 12 , {message : "رمز عبور باید بین 6 الی 12 کلمه باشد"})
    public password!: string;
}
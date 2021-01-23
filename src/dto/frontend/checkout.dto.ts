import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
export default class CheckoutDTO {

    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    public rPhoneNumber!: string;

    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    public rFullName!: string;

    @IsString({ message: "لطفا شماره تلفن خود را وارد نمایید" })
    public rAddress!: string;

    @IsString({ message: "لطفا کد پستی خود را به صورت عدد و صحیح نمایید" })
    @Length(10 , 10 , {message : "کد پستی باید 10 رقم باشد"})
    public rPostalCode!: string;

    public redirectTo : string = "/checkout"
}
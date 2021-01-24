import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
export default class SearchDTO {

    @IsString({ message: "مقدار سرچ شده شما نباید خالی باشد , مجددا تلاش نمایید" })
    public q!: string;
    
}
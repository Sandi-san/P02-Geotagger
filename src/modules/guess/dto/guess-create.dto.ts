import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateGuessDto {
    @ApiProperty()
    @IsNumber()
    lat: number;

    @ApiProperty()
    @IsNumber()
    lon: number;
}
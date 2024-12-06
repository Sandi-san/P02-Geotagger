import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image: string;

    @ApiProperty()
    @IsNumber()
    lat: number;

    @ApiProperty()
    @IsNumber()
    lon: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;
}
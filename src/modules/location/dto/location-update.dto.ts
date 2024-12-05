import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateLocationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lat: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    lon: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address: string;
}
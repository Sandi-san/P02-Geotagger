import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UserActionDto {
    @ApiProperty()
    @IsString()
    action: string;

    @ApiProperty()
    @IsString()
    type: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    newValue: string;

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) // Convert ISO string to Date
    timestamp: Date;
}

export class CreateUserActionDto {
  @ApiProperty({ type: [UserActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserActionDto)
  actions: UserActionDto[];
}
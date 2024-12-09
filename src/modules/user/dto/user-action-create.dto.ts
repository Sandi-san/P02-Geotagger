import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UserActionDto {
    @ApiProperty()
    @IsString()
    action: string;

    @ApiProperty()
    @IsString()
    type: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    newValue: number;

    @ApiProperty()
    @IsString()
    url: string;
}

export class CreateUserActionDto {
  @ApiProperty({ type: [UserActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserActionDto)
  actions: UserActionDto[];
}
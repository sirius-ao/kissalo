import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsBoolean,
    IsArray,
    IsString,
    IsObject,
    Matches,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCategoryDto {

    @ApiProperty({
        description: 'Category title',
        example: 'Eletricidade',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Category slug (lowercase, sem espaços)',
        example: 'eletricidade',
    })

    @ApiProperty({
        description: 'Category description',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Category tags',
        example: ['energia', 'reparos'],
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({
        description: 'Category color (hex)',
        example: '#FFAA00',
    })
    @IsNotEmpty()
    @IsString()
    color: string;

    @ApiProperty({
        description: 'Category order',
        example: 1,
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    order: number;

    @ApiProperty({
        description: 'Is category featured?',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({
        description: 'Category cover URL',
        example: 'https://example.com/cover.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    coverUrl?: string;

    @ApiProperty({
        description: 'Is category active?',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({
        description: 'Category statistics',
        example: { totalServices: 100, totalProviders: 25 },
        required: false,
    })
    @IsOptional()
    @IsObject()
    stats?: object;

}

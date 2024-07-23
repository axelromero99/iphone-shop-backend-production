// pagination.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, IsString, IsEnum, IsArray, IsBoolean } from 'class-validator';

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @IsOptional()
    @IsString()
    sortField?: string;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.ASC;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    searchFields?: string[];

    @IsOptional()
    @IsString()
    searchValue?: string;

    @IsOptional()
    @IsString()
    useRegex?: string = 'true';
}

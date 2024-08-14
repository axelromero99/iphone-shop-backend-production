import { Injectable } from '@nestjs/common';
import { Model, Document, Query } from 'mongoose';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class PaginationService {
    async paginate<T extends Document>(
        modelOrQuery: any,
        paginationDto: PaginationDto,
    ) {
        const {
            limit = 10,
            offset = 0,
            sortField,
            sortOrder,
            searchFields,
            searchValue,
            useRegex = true,
        } = paginationDto;

        let query: any;
        if ('find' in modelOrQuery && typeof modelOrQuery.find === 'function') {
            query = modelOrQuery.find();
        } else {
            query = modelOrQuery;
        }
        // Apply search
        if (searchFields && searchFields.length > 0 && searchValue) {
            const searchConditions = searchFields.map(field =>
                this.createSearchCondition(field, searchValue, useRegex)
            );
            query = query.or(searchConditions);
        }

        // Apply sorting
        if (sortField) {
            const sortDirection = sortOrder === 'DESC' ? -1 : 1;
            query = query.sort({ [sortField]: sortDirection });
        }

        // Execute query
        const totalCount = await (modelOrQuery instanceof Model ? modelOrQuery.countDocuments(query.getFilter()) : query.countDocuments());
        const results = await query.skip(offset).limit(limit).exec();

        // Calculate pagination metadata
        const pageCount = Math.ceil(totalCount / limit);
        const currentPage = Math.floor(offset / limit) + 1;
        const hasNextPage = currentPage < pageCount;
        const hasPreviousPage = currentPage > 1;

        return {
            data: results,
            metadata: {
                totalCount,
                pageCount,
                currentPage,
                hasNextPage,
                hasPreviousPage,
                limit,
                offset,
            },
        };
    }

    private createSearchCondition(field: string, searchValue: string, useRegex: boolean): any {
        const fieldParts = field.split('.');
        let condition = {};
        let currentLevel = condition;

        fieldParts.forEach((part, index) => {
            if (index === fieldParts.length - 1) {
                currentLevel[part] = useRegex
                    ? { $regex: searchValue, $options: 'i' }
                    : searchValue;
            } else {
                currentLevel[part] = {};
                currentLevel = currentLevel[part];
            }
        });

        return condition;
    }
}
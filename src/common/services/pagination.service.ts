import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class PaginationService {
    async paginate<T>(
        model: Model<any>,
        paginationDto: PaginationDto,
    ) {
        const {
            useRegex, limit, offset, sortField, sortOrder, searchFields, searchValue,
        } = paginationDto;

        let query = model.find();

        if (useRegex === 'true') {
            if (searchFields && searchFields.length > 0 && searchValue) {
                const searchConditions = searchFields.map(field => ({
                    [field]: { $regex: searchValue, $options: 'i' },
                }));
                query = query.where({ $or: searchConditions });
            }
        } else {
            if (searchFields && searchFields.length > 0 && searchValue) {
                const searchConditions = searchFields.map(field => ({
                    [field]: searchValue
                }));
                query = query.where({ $or: searchConditions });
            }
        }


        if (sortField) {
            const sortDirection = sortOrder === 'ASC' ? 1 : -1;
            query = query.sort({ [sortField]: sortDirection });
        }

        const resultsQuery = query.skip(offset).limit(limit);
        const countQuery = model.countDocuments(query);

        const [results, totalCount] = await Promise.all([
            resultsQuery.exec(),
            countQuery,
        ]);

        const pageCount = Math.ceil(totalCount / limit);
        const currentPage = Math.floor(offset / limit) + 1;
        const hasNextPage = limit * currentPage < totalCount;
        const hasPreviousPage = currentPage > 1;

        return {
            data: results,
            totalCount,
            pageCount,
            currentPage,
            hasNextPage,
            hasPreviousPage,
        };
    }
}

import { PaginationStateInterface } from '../models/pagination-state.interface';

export const paginationState: PaginationStateInterface = {
    page: 0,
    limit: 10,
    sort: 'name',
    sortDir: 'asc',
};

export const usersCount = 100000;

export interface PaginationStateInterface {
    page: number, 
    limit: number, 
    sort: 'name' | 'age', 
    sortDir: 'asc' | 'desc' | '',
}

export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface ColumnSort {
    orderBy: string
    sortDirection: SortType
}

export interface IFilter {
    pageNumber?: number
    pageSize?: number
    sort?: ColumnSort[]
}

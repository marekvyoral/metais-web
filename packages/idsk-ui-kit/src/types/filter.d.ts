export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface ColumnSort {
    orderBy: string
    sortDirection: SortType
}

export interface IFilter {
    [key: string]: string | boolean | undefined | string[] | Date | null | IAttributeFilters
    pageNumber?: number
    pageSize?: number
    sort?: ColumnSort[]
}

export enum SortBy {
    HIERARCHY_FROM_ROOT = 'HIERARCHY_FROM_ROOT',
    GEN_PROFIL_NAZOV = 'Gen_Profil_nazov',
    NAME = 'name',
}

export enum MetaAttributesState {
    DRAFT = 'DRAFT',
}

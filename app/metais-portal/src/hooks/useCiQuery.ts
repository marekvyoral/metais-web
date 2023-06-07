import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { IListQueryArgs, postTableData } from '@/api/TableApi'

interface Pagination {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
}

interface Attribute {
    name: string
    value: string | string[]
}

interface MetaAttributes {
    owner: string
    state: string
    createdBy: string
    createdAt: string
    lastModifiedBy: string
    lastModifiedAt: string
}

interface ConfigurationItem {
    type: string
    uuid: string
    attributes: Attribute[]
    metaAttributes: MetaAttributes
}

export interface ICiQueryData {
    pagination: Pagination
    configurationItemSet: ConfigurationItem[]
    incidentRelationshipSet: unknown[]
}

export const useCiQuery = (params: IListQueryArgs) => {
    const ciQuery: UseQueryResult<ICiQueryData, unknown> = useQuery({
        queryKey: ['tableData', params],
        queryFn: () => postTableData(params),
    })

    const { isLoading, isError, data } = ciQuery

    return {
        isLoading,
        isError,
        data,
    }
}

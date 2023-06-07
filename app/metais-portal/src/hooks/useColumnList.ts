import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { getColumnList } from '@/api/TableApi'

interface Attribute {
    name: string
    order: number
}

interface MetaAttribute {
    name: string
    order: number
}

export interface IColumn {
    id: number
    ciType: string
    attributes: Attribute[]
    metaAttributes: MetaAttribute[]
}

export const useColumnList = (entityName: string) => {
    const columnList: UseQueryResult<IColumn, unknown> = useQuery({
        queryKey: ['columnsList', entityName],
        queryFn: () => getColumnList(entityName),
    })

    const { data, isLoading, isError } = columnList

    return {
        isLoading,
        isError,
        data,
    }
}

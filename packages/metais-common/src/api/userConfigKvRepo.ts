// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useUserConfigSwaggerClient } from '@isdd/metais-common/api/hooks/useUserConfigSwaggerClient'
import { NeighbourPairUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

export interface IStoreColumnData {
    name: string
    order: number
}

export interface IAttributeEnum {
    technicalName: string
    enumCode: string
}

export type RelationSelectedRowType = Record<string, NeighbourPairUi>

export const useGetRelationColumnsHook = (): ((urlKey: string) => Promise<IStoreColumnData[]>) => {
    const getRelationColumns = useUserConfigSwaggerClient<IStoreColumnData[]>()

    return (urlKey: string) => {
        return getRelationColumns({ url: `/kv/${urlKey}`, method: 'get' })
    }
}

export const useUpdateRelationColumnsHook = () => {
    const updateRelationColumns = useUserConfigSwaggerClient<void>()

    return (urlKey: string, data: IStoreColumnData[]) => {
        return updateRelationColumns({ url: `/kv/${urlKey}`, method: 'put', headers: { 'Content-Type': 'application/json' }, data })
    }
}

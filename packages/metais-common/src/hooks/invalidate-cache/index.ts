import { useQueryClient } from '@tanstack/react-query'

import {
    CiListFilterContainerUi,
    getGetRoleParticipantBulkQueryKey,
    getReadCiList1QueryKey,
    getReadCiNeighboursWithAllRelsQueryKey,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { getFindByUuid3QueryKey } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    getGetCodelistHeaderQueryKey,
    getGetOriginalCodelistHeaderQueryKey,
    getGetCodelistHeadersQueryKey,
    getGetCodelistItemsQueryKey,
    getGetCodelistHistoryQueryKey,
    getGetCodelistActionsHistoryQueryKey,
    getGetTemporalCodelistHeaderWithLockQueryKey,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'

const isCiListFilterContainerUi = (obj: unknown): obj is CiListFilterContainerUi => {
    return !!obj && typeof obj === 'object'
}

type InvalidateCiListFilteredCacheArgs = {
    ciType?: string
    ciUuid?: string
}

export const useInvalidateCiListFilteredCache = () => {
    const queryClient = useQueryClient()

    //gets query key for cilistfiltered call useReadCiList1() from CiListContainer
    const listQueryKey = getReadCiList1QueryKey({})

    const invalidate = ({ ciType, ciUuid }: InvalidateCiListFilteredCacheArgs) => {
        //with [0] we invalidate all queries with any filter( query [1])
        if (ciType) {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === listQueryKey[0] &&
                    isCiListFilterContainerUi(query.queryKey[1]) &&
                    query.queryKey[1].filter?.type?.[0] === ciType,
            })
        } else if (ciUuid) {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === listQueryKey[0] &&
                    isCiListFilterContainerUi(query.queryKey[1]) &&
                    query.queryKey[1].filter?.poUuid === ciUuid,
            })
        } else {
            queryClient.invalidateQueries([listQueryKey[0]])
        }
    }

    return { invalidate }
}

export const useInvalidateCiItemCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (ciItemUuid: string) => {
        const ciItemQueryKey = [CI_ITEM_QUERY_KEY, ciItemUuid]
        queryClient.invalidateQueries(ciItemQueryKey)
    }

    return { invalidate }
}

export const useInvalidateCiNeighboursWithAllRelsCache = (ciItemUuid: string) => {
    const queryClient = useQueryClient()
    const listQueryKey = getReadCiNeighboursWithAllRelsQueryKey(ciItemUuid)

    const invalidate = () => {
        queryClient.invalidateQueries([listQueryKey[0]])
    }

    return { invalidate }
}

export const useInvalidateGroupsDetailCache = (id: string) => {
    const findByUuid3QueryKey = getFindByUuid3QueryKey(id)
    const queryClient = useQueryClient()

    const invalidate = () => {
        queryClient.invalidateQueries(findByUuid3QueryKey)
    }

    return { invalidate }
}

export const useInvalidateCodeListCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (code: string, id: number) => {
        queryClient.invalidateQueries([getGetCodelistHeaderQueryKey(id)[0]])
        queryClient.invalidateQueries([getGetOriginalCodelistHeaderQueryKey(code)[0]])
        queryClient.invalidateQueries([getGetRoleParticipantBulkQueryKey({})[0]])
        queryClient.invalidateQueries([getGetCodelistHeadersQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]])
        queryClient.invalidateQueries([getGetCodelistItemsQueryKey(code, { language: '', pageNumber: 0, perPage: 0 })[0]])
        queryClient.invalidateQueries([getGetCodelistHistoryQueryKey(code)[0]])
        queryClient.invalidateQueries(getGetCodelistActionsHistoryQueryKey(code, 'actions'))
        queryClient.invalidateQueries(getGetCodelistActionsHistoryQueryKey(code, 'modifiedBy'))
        queryClient.invalidateQueries(getGetTemporalCodelistHeaderWithLockQueryKey(code))
    }

    return { invalidate }
}

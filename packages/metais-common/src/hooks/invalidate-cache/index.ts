import { useQueryClient } from '@tanstack/react-query'

import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import {
    CiListFilterContainerUi,
    getGetRoleParticipantBulkQueryKey,
    getReadCiHistoryVersionsQueryKey,
    getReadCiList1QueryKey,
    getReadCiNeighboursWithAllRelsQueryKey,
    getReadConfigurationItemQueryKey,
    getReadNeighboursConfigurationItemsCountQueryKey,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    getGetCodelistActionsHistoryQueryKey,
    getGetCodelistHeaderQueryKey,
    getGetCodelistHeadersQueryKey,
    getGetCodelistHistoryQueryKey,
    getGetCodelistItemsQueryKey,
    getGetCodelistRequestDetailQueryKey,
    getGetCodelistRequestItemsQueryKey,
    getGetCodelistRequestsQueryKey,
    getGetOriginalCodelistHeaderQueryKey,
    getGetTemporalCodelistHeaderWithLockQueryKey,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { getGetMetaQueryKey } from '@isdd/metais-common/api/generated/dms-swagger'
import { getFind2111QueryKey, getFindByUuid3QueryKey, getFindRelatedIdentitiesAndCountQueryKey } from '@isdd/metais-common/api/generated/iam-swagger'
import { getGetTraineesQueryKey, getGetTrainingsForUserQueryKey } from '@isdd/metais-common/api/generated/trainings-swagger'
import { getGetAttributeProfileQueryKey } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

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

export const useInvalidateDmsFileCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (ciItemUuid: string) => {
        const QK = getGetMetaQueryKey(ciItemUuid)
        queryClient.invalidateQueries(QK)
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

export const useInvalidateCiHistoryListCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (ciItemUuid: string) => {
        const ciItemQueryKey = getReadCiHistoryVersionsQueryKey(ciItemUuid, { page: BASE_PAGE_NUMBER, perPage: BASE_PAGE_SIZE })?.[0]

        queryClient.invalidateQueries([ciItemQueryKey])
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

    const invalidateCodelists = (code: string, id: number) => {
        // invalidate codelists requests cache for lists and selected codelist
        queryClient.invalidateQueries([getGetCodelistHeaderQueryKey(id)[0]])
        queryClient.invalidateQueries([getGetOriginalCodelistHeaderQueryKey(code)[0]])
        queryClient.invalidateQueries([getGetRoleParticipantBulkQueryKey({})[0]])
        queryClient.invalidateQueries([getGetCodelistHeadersQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]])
        queryClient.invalidateQueries([getGetCodelistItemsQueryKey(code, { language: '', pageNumber: 0, perPage: 0 })[0]])
        queryClient.invalidateQueries([getGetCodelistHistoryQueryKey(code)[0]])
        queryClient.invalidateQueries([getGetCodelistActionsHistoryQueryKey(code, 'actions')[0]])
        queryClient.invalidateQueries([getGetCodelistActionsHistoryQueryKey(code, 'modifiedBy')[0]])
        queryClient.invalidateQueries([getGetTemporalCodelistHeaderWithLockQueryKey(code)[0]])
    }

    const invalidateRequests = (id?: number) => {
        // invalidate codelists requests cache for lists and selected request
        queryClient.invalidateQueries([getGetCodelistRequestsQueryKey({ language: '', pageNumber: 0, perPage: 0 })[0]])
        if (id) {
            queryClient.invalidateQueries([getGetCodelistRequestDetailQueryKey(id)[0]])
            queryClient.invalidateQueries([getGetCodelistRequestItemsQueryKey(id, { language: '', pageNumber: 0, perPage: 0 })[0]])
        }
    }

    const invalidateAll = () => {
        // invalidates whole codelists cache regardless id/code
        queryClient.invalidateQueries({
            predicate: (query) => {
                return query.queryHash.startsWith('["/codelists')
            },
        })
    }

    return { invalidateCodelists, invalidateRequests, invalidateAll }
}

export const useInvalidateAttributeProfileCache = (entityName: string) => {
    const queryClient = useQueryClient()
    const profileQueryKey = getGetAttributeProfileQueryKey(entityName)
    const invalidate = () => {
        queryClient.invalidateQueries(profileQueryKey)
    }
    return { invalidate }
}

export const useInvalidateTrainingsCache = (entityId: string) => {
    const queryClient = useQueryClient()
    const invalidate = () => {
        queryClient.invalidateQueries([CI_ITEM_QUERY_KEY, entityId])
        queryClient.invalidateQueries(getGetTrainingsForUserQueryKey())
        queryClient.invalidateQueries(getGetTraineesQueryKey(entityId))
    }
    return { invalidate }
}

export const useInvalidateGroupsListCache = () => {
    const find2111QueryKey = getFind2111QueryKey()
    const queryClient = useQueryClient()
    const invalidate = () => {
        queryClient.invalidateQueries(find2111QueryKey)
    }
    return { invalidate }
}

export const useInvalidateGroupMembersCache = (uuid: string) => {
    const groupMemebrsQueryKey = getFindRelatedIdentitiesAndCountQueryKey(uuid)
    const queryClient = useQueryClient()
    const invalidate = () => {
        queryClient.invalidateQueries(groupMemebrsQueryKey)
    }
    return { invalidate }
}

export const useInvalidateRelationsForCiCache = () => {
    const queryClient = useQueryClient()
    const invalidate = (uuid: string) => {
        const ciNeighboursWithAllRelsQueryKey = getReadCiNeighboursWithAllRelsQueryKey(uuid)
        queryClient.invalidateQueries(ciNeighboursWithAllRelsQueryKey)
    }
    return { invalidate }
}

export const useInvalidateRelationsCountCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (uuid: string) => {
        const ciNeighboursCountQueryKey = getReadNeighboursConfigurationItemsCountQueryKey(uuid)
        queryClient.invalidateQueries(ciNeighboursCountQueryKey)
    }
    return { invalidate }
}

export const useInvalidateCiReadCache = () => {
    const queryClient = useQueryClient()

    const invalidate = (uuid: string) => {
        const ciQueryKey = getReadConfigurationItemQueryKey(uuid)
        queryClient.invalidateQueries(ciQueryKey)
    }
    return { invalidate }
}

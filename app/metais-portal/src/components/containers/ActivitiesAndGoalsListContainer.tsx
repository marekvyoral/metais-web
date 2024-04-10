import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import {
    ConfigurationItemUi,
    useGetUuidHook,
    useInvalidateRelationship,
    useReadCiList1,
    useReadCiNeighbours,
    useReadConfigurationItem,
    useStoreGraph,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import {
    useInvalidateCiNeighboursWithAllRelsCache,
    useInvalidateDerivedRelationsCountCache,
    useInvalidateRelationsCountCache,
} from '@isdd/metais-common/hooks/invalidate-cache'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useCanCreateGraph } from '@isdd/metais-common/src/hooks/useCanCreateGraph'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export interface TableCols extends ConfigurationItemUi {
    checked?: boolean
    relationUuid?: string
}

export interface IView {
    tableData?: TableCols[]
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    setDataRows: React.Dispatch<React.SetStateAction<TableCols[]>>
    isOwnerOfCi: boolean | undefined
    relateItemToProject: (activityUuid?: string) => Promise<void>
    filter: {
        sort: never[]
        pageNumber: number
        pageSize: number
        fullTextSearch: string
    }
    totaltems?: number | undefined
    invalidateItemRelationToProject: (activityUuid?: string, uuid?: string) => Promise<void>
    isInvalidated: boolean
    ciType: string
    ciItemData: ConfigurationItemUi | undefined
    canCreateGraph: boolean
    isMutateLoading: boolean
    isMutateSuccess: boolean
    isMutateError: boolean
    resetSuccess: () => void
    resetError: () => void
}

interface IActivitiesAndGoalsListContainer {
    configurationItemId?: string
    ciType: string
    relType: string
    View: React.FC<IView>
}

export const defaultFilter = {
    sort: [],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    fullTextSearch: '',
}

export const ActivitiesAndGoalsListContainer: React.FC<IActivitiesAndGoalsListContainer> = ({ configurationItemId, View, ciType, relType }) => {
    const {
        state: { user, token },
    } = useAuth()

    const {
        getRequestStatus,
        isError: isRequestError,
        isLoading: isRequestLoading,
        isSuccess: isRequestSuccess,
        resetSuccess,
        resetError,
    } = useGetStatus()
    const { currentPreferences } = useUserPreferences()
    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
    const { data: ciData, isLoading: ciLoading } = useReadConfigurationItem(configurationItemId ?? '')
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED

    const { invalidate: invalidateRelatedCountCache } = useInvalidateRelationsCountCache()
    const { invalidate: invalidateDerivedRelationsCountCache } = useInvalidateDerivedRelationsCountCache()
    const { invalidate: invalidateCiNeighboursWithAllRelsCache } = useInvalidateCiNeighboursWithAllRelsCache()

    const isLoggedIn = !!user?.uuid

    const {
        data: isOwnerByGid,
        isLoading: isOwnerByGidLoading,
        isError: isOwnerByGidError,
        fetchStatus: isOwnerByGidFetchStatus,
    } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && isLoggedIn } },
    )

    const { data: canCreateGraph, isError: isCanCreateGraphError, isLoading: isCanCreateGraphLoading } = useCanCreateGraph()

    const generateUuid = useGetUuidHook()

    const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner

    const [defaultRequestApi, setDefaultRequestApi] = useState({
        filter: {
            type: [ciType],
            metaAttributes,
            fullTextSearch: '',
        },
        getIncidentRelations: true,
    })

    const currentNeighboursFilter = useMemo(() => {
        return {
            neighboursFilter: {
                ciType: [ciType],
                reltype: [relType],
            },
        }
    }, [ciType, relType])

    const { filter, handleFilterChange } = useFilterParams(defaultFilter)

    useEffect(() => {
        if (defaultRequestApi.filter.fullTextSearch != filter.fullTextSearch) {
            setDefaultRequestApi({
                ...defaultRequestApi,
                filter: { ...defaultRequestApi.filter, fullTextSearch: latiniseString(filter.fullTextSearch) },
            })
        }
    }, [defaultRequestApi, filter.fullTextSearch])

    const filterForCiList = useMemo(() => mapFilterToNeighborsApi(filter, defaultRequestApi), [defaultRequestApi, filter])
    const { isLoading, isError, data: listData } = useReadCiList1(filterForCiList)

    //Load related
    const {
        isLoading: isCurrentNeighboursLoading,
        isError: isCurrentNeighboursError,
        data: currentNeighbours,
        refetch,
        isFetching: areNeighboursFetching,
    } = useReadCiNeighbours(configurationItemId ?? '', currentNeighboursFilter)

    const [dataRows, setDataRows] = useState<TableCols[]>([])
    useEffect(() => {
        if (listData && currentNeighbours && !areNeighboursFetching) {
            setDataRows(
                listData?.configurationItemSet?.map((ci) => {
                    const related = currentNeighbours.fromNodes?.neighbourPairs?.find(
                        (np) => np.configurationItem?.uuid == ci.uuid && np.relationship?.metaAttributes?.state !== INVALIDATED,
                    )
                    return {
                        ...ci,
                        checked: !!related,
                        relationUuid: related?.relationship?.uuid,
                    }
                }) ?? [],
            )
        }
    }, [listData, currentNeighbours, areNeighboursFetching])

    const invalidateCache = useCallback(
        (uuids: (string | undefined)[]) => {
            uuids.forEach((uuid) => {
                if (uuid) {
                    invalidateRelatedCountCache(uuid)
                    invalidateDerivedRelationsCountCache(uuid)
                    invalidateCiNeighboursWithAllRelsCache(uuid)
                }
            })
            refetch()
        },
        [invalidateCiNeighboursWithAllRelsCache, invalidateDerivedRelationsCountCache, invalidateRelatedCountCache, refetch],
    )

    const invalidateRelation = useInvalidateRelationship({
        mutation: {
            onSuccess(data, variables) {
                if (data.requestId) {
                    getRequestStatus(data.requestId, () => {
                        invalidateCache([variables.data.endUuid, variables.data.startUuid])
                    })
                }
            },
        },
    })

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess(data, variables) {
                if (data.requestId) {
                    getRequestStatus(data.requestId, () => {
                        invalidateCache([
                            variables.data.storeSet?.relationshipSet ? variables.data.storeSet?.relationshipSet[0].endUuid : undefined,
                            variables.data.storeSet?.relationshipSet ? variables.data.storeSet?.relationshipSet[0].startUuid : undefined,
                        ])
                    })
                }
            },
        },
    })

    //Add relation
    const relateItemToProject = useCallback(
        async (itemUuid: string | undefined) => {
            const uuid = await generateUuid()
            storeGraph.mutateAsync({
                data: {
                    storeSet: {
                        relationshipSet: [
                            {
                                attributes: [],
                                endUuid: itemUuid,
                                owner: ciData?.metaAttributes?.owner,
                                startUuid: configurationItemId,
                                type: relType,
                                uuid: uuid,
                            },
                        ],
                    },
                },
            })
        },
        [ciData?.metaAttributes?.owner, configurationItemId, generateUuid, relType, storeGraph],
    )

    const invalidateItemRelationToProject = useCallback(
        async (itemUuid: string | undefined, uuid: string | undefined) => {
            //500 error report
            invalidateRelation.mutateAsync({
                data: {
                    attributes: [],
                    endUuid: itemUuid,
                    invalidateReason: {
                        comment: 'KRIS/SU',
                    },
                    startUuid: configurationItemId,
                    type: relType,
                    uuid: uuid,
                },
                params: {
                    newState: [INVALIDATED],
                },
            })
        },
        [configurationItemId, invalidateRelation, relType],
    )

    return (
        <View
            invalidateItemRelationToProject={invalidateItemRelationToProject}
            totaltems={listData?.pagination?.totaltems}
            filter={filter}
            relateItemToProject={relateItemToProject}
            isOwnerOfCi={isOwnerOfCi}
            tableData={dataRows}
            handleFilterChange={handleFilterChange}
            isLoading={
                isLoading ||
                areNeighboursFetching ||
                isCurrentNeighboursLoading ||
                isCanCreateGraphLoading ||
                (isOwnerByGidLoading && isOwnerByGidFetchStatus != 'idle')
            }
            isError={isError || isCurrentNeighboursError || isCanCreateGraphError || isOwnerByGidError}
            isMutateLoading={invalidateRelation.isLoading || storeGraph.isLoading || isRequestLoading}
            isMutateSuccess={(invalidateRelation.isSuccess || storeGraph.isSuccess) && isRequestSuccess}
            isMutateError={invalidateRelation.isError || storeGraph.isError || isRequestError}
            setDataRows={setDataRows}
            isInvalidated={isInvalidated}
            ciType={ciType}
            ciItemData={ciData}
            canCreateGraph={!!canCreateGraph}
            resetSuccess={resetSuccess}
            resetError={resetError}
        />
    )
}

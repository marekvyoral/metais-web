import { IFilter } from '@isdd/idsk-ui-kit/types'
import {
    ConfigurationItemUi,
    useGetUuidHook,
    useInvalidateRelationshipHook,
    useReadCiList1,
    useReadCiNeighbours,
    useReadConfigurationItem,
    useStoreGraphHook,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useEffect, useState } from 'react'

export interface TableCols extends ConfigurationItemUi {
    checked?: boolean
    relationUuid?: string
}

export interface IView {
    activities?: ConfigurationItemUi[]
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

    const { currentPreferences } = useUserPreferences()
    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
    const { data: ciData, isLoading: ciLoading } = useReadConfigurationItem(configurationItemId ?? '')
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED
    const invalidateRelation = useInvalidateRelationshipHook()
    const storeGraph = useStoreGraphHook()

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null } },
    )

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

    const currentNeighboursFilter = {
        neighboursFilter: {
            ciType: [ciType],
            reltype: [relType],
        },
    }

    const { filter, handleFilterChange } = useFilterParams(defaultFilter)

    useEffect(() => {
        if (defaultRequestApi.filter.fullTextSearch != filter.fullTextSearch) {
            setDefaultRequestApi({
                ...defaultRequestApi,
                filter: { ...defaultRequestApi.filter, fullTextSearch: latiniseString(filter.fullTextSearch) },
            })
        }
    }, [defaultRequestApi, filter.fullTextSearch])

    const { isLoading, isError, data: listData } = useReadCiList1(mapFilterToNeighborsApi(filter, defaultRequestApi))

    //Load related
    //400 error report bug
    const {
        isLoading: isCurrentNeighboursLoading,
        isError: isCurrentNeighboursError,
        data: currentNeighbours,
    } = useReadCiNeighbours(configurationItemId ?? '', currentNeighboursFilter)

    const [dataRows, setDataRows] = useState<TableCols[]>([])

    useEffect(() => {
        if (listData && currentNeighbours) {
            setDataRows(
                listData?.configurationItemSet?.map((ci) => {
                    const related = currentNeighbours.fromNodes?.neighbourPairs?.find((np) => np.configurationItem?.uuid == ci.uuid)
                    return {
                        ...ci,
                        checked: !!related,
                        relationUuid: related?.relationship?.uuid,
                    }
                }) ?? [],
            )
        }
    }, [listData, currentNeighbours])

    //Add relation
    const relateItemToProject = async (itemUuid: string | undefined) => {
        const uuid = await generateUuid()
        storeGraph({
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
        })
    }

    const invalidateItemRelationToProject = async (itemUuid: string | undefined, uuid: string | undefined) => {
        //500 error report
        invalidateRelation(
            {
                attributes: [],
                endUuid: itemUuid,
                invalidateReason: {
                    comment: 'KRIS/SU',
                },
                startUuid: configurationItemId,
                type: relType,
                uuid: uuid,
            },
            { newState: [] },
        )
    }

    return (
        <View
            invalidateItemRelationToProject={invalidateItemRelationToProject}
            totaltems={listData?.pagination?.totaltems}
            filter={filter}
            relateItemToProject={relateItemToProject}
            isOwnerOfCi={isOwnerOfCi}
            activities={dataRows}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isCurrentNeighboursLoading}
            isError={isError || isCurrentNeighboursError}
            setDataRows={setDataRows}
            isInvalidated={isInvalidated}
            ciType={ciType}
            ciItemData={ciData}
        />
    )
}

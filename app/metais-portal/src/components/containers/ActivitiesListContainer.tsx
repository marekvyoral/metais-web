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
import { ACTIVITY, INVALIDATED, P_REALIZUJE_AKT } from '@isdd/metais-common/constants'
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
    relateActivityToProject: (activityUuid?: string) => Promise<void>
    filter: {
        sort: never[]
        pageNumber: number
        pageSize: number
        fullTextSearch: string
    }
    totaltems?: number | undefined
    invalidateRelationActivityToProject: (activityUuid?: string, uuid?: string) => Promise<void>
    isInvalidated: boolean
}

interface IActivitiesListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const defaultFilter = {
    sort: [],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    fullTextSearch: '',
}

export const ActivitiesListContainer: React.FC<IActivitiesListContainer> = ({ configurationItemId, View }) => {
    const {
        state: {
            userInfo,
            userContext: { token },
        },
    } = useAuth()
    const { currentPreferences } = useUserPreferences()
    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
    const { data: ciData, isLoading: ciLoading } = useReadConfigurationItem(configurationItemId ?? '')
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED
    const invalidateRelation = useInvalidateRelationshipHook()
    const storeActivity = useStoreGraphHook()

    const { data: isOwnerByGid } = useIsOwnerByGid(
        {
            gids: [ciData?.metaAttributes?.owner ?? ''],
            login: userInfo?.login,
        },
        { query: { enabled: !ciLoading && token !== null } },
    )

    const generateUuid = useGetUuidHook()

    const isOwnerOfCi = isOwnerByGid?.isOwner?.[0]?.owner

    const [defaultRequestApi, setDefaultRequestApi] = useState({
        filter: {
            type: [ACTIVITY],
            metaAttributes,
            fullTextSearch: '',
        },
        getIncidentRelations: true,
    })

    const currentActivitiesFilter = {
        neighboursFilter: {
            ciType: [ACTIVITY],
            metaAttributes,
            reltype: [P_REALIZUJE_AKT],
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

    const { isLoading, isError, data: activities } = useReadCiList1(mapFilterToNeighborsApi(filter, defaultRequestApi))

    //Load related activities
    const {
        isLoading: isCurrentActivitiesLoading,
        isError: isCurrentActivitiesError,
        data: currentActivities,
    } = useReadCiNeighbours(configurationItemId ?? '', currentActivitiesFilter)

    const [dataRows, setDataRows] = useState<TableCols[]>([])

    useEffect(() => {
        if (activities && currentActivities) {
            setDataRows(
                activities?.configurationItemSet?.map((ci) => {
                    const related = currentActivities.fromNodes?.neighbourPairs?.find((np) => np.configurationItem?.uuid == ci.uuid)
                    return {
                        ...ci,
                        checked: !!related,
                        relationUuid: related?.relationship?.uuid,
                    }
                }) ?? [],
            )
        }
    }, [activities, currentActivities])

    //Add relation
    const relateActivityToProject = async (activityUuid: string | undefined) => {
        const uuid = await generateUuid()
        storeActivity({
            storeSet: {
                relationshipSet: [
                    {
                        attributes: [],
                        endUuid: activityUuid,
                        owner: ciData?.metaAttributes?.owner,
                        startUuid: configurationItemId,
                        type: P_REALIZUJE_AKT,
                        uuid: uuid,
                    },
                ],
            },
        })
    }

    const invalidateRelationActivityToProject = async (activityUuid: string | undefined, uuid: string | undefined) => {
        invalidateRelation(
            {
                attributes: [],
                endUuid: activityUuid,
                invalidateReason: {
                    comment: 'KRIS/SU',
                },
                startUuid: configurationItemId,
                type: P_REALIZUJE_AKT,
                uuid: uuid,
            },
            { newState: [] },
        )
    }

    return (
        <View
            invalidateRelationActivityToProject={invalidateRelationActivityToProject}
            totaltems={activities?.pagination?.totaltems}
            filter={filter}
            relateActivityToProject={relateActivityToProject}
            isOwnerOfCi={isOwnerOfCi}
            activities={dataRows}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isCurrentActivitiesLoading}
            isError={isError || isCurrentActivitiesError}
            setDataRows={setDataRows}
            isInvalidated={isInvalidated}
        />
    )
}

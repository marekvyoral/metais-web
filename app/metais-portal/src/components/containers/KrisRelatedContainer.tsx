import {
    CiListFilterContainerUi,
    ConfigurationItemSetUi,
    ConfigurationItemUi,
    useReadCiList1,
    useReadNeighboursConfigurationItems,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    CI_TYPES_QUERY_KEY,
    ENTITY_AGENDA,
    ENTITY_ISVS,
    ENTITY_KS,
    ENTITY_PROJECT,
    ENTITY_ZS,
    krisRelatedCiTabsNames,
    PO,
    PO_predklada_KRIS,
} from '@isdd/metais-common/constants'
import { UserPreferencesFormNamesEnum, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import React, { useMemo, useState } from 'react'
import { useAgendaAndZsCezPo } from '@isdd/metais-common/src/hooks/useAgendaAndZsCezPo'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { useListCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetCiTabDataForKris } from '@isdd/metais-common/hooks/useGetCiTabDataForKris'
import { useTranslation } from 'react-i18next'

import { KrisRelatedItemsView } from '@/components/views/ci/kris/KrisRelatedItemsView'

type Props = {
    currentKrisUuid: string
}

export type KrisRelatedPagination = {
    pageNumber: number
    pageSize: number
    dataLength: number
}

export type KrisData = {
    projectListData?: ConfigurationItemSetUi
    ISVSListData?: ConfigurationItemSetUi
    KSListData?: ConfigurationItemSetUi
    ciListData?: ConfigurationItemSetUi
    zsData?: ConfigurationItemUi[]
    agendaData?: ConfigurationItemUi[]
}

export type KrisKeysToDisplayType = {
    technicalName: string
    title: string
    count: number
}

type AgendaAndZsCustomType = ConfigurationItemUi & {
    attributes: { name: string; value: string }[]
    metaAttributes: { name: string; value: string }[]
}

const remmapNameAndValueArrayToObj = (dataToRemap: AgendaAndZsCustomType[]): ConfigurationItemUi[] => {
    const remapped: ConfigurationItemUi[] = dataToRemap?.map((item) => ({
        ...item,
        attributes: item?.attributes?.reduce((acc, obj) => ({ ...acc, [obj.name]: obj.value })),
    }))
    return remapped
}

export const KrisRelatedContainer: React.FC<Props> = ({ currentKrisUuid }) => {
    const { currentPreferences } = useUserPreferences()
    const { i18n } = useTranslation()

    const showInvalidated = currentPreferences?.[UserPreferencesFormNamesEnum.SHOW_INVALIDATED] ?? false
    const preferredPageSize = currentPreferences.defaultPerPage ?? BASE_PAGE_SIZE

    const {
        data: ciNeighboursData,
        isLoading: isCiNeighboursLoading,
        isError: isCiNeighboursError,
    } = useReadNeighboursConfigurationItems(currentKrisUuid, {
        nodeType: PO,
        relationshipType: PO_predklada_KRIS,
        includeInvalidated: showInvalidated,
    })

    const neighboursUuid = ciNeighboursData?.toCiSet?.[0]?.uuid ?? ''

    const defaultPagination: KrisRelatedPagination = useMemo(() => {
        return {
            pageNumber: BASE_PAGE_NUMBER,
            pageSize: parseInt(preferredPageSize),
            dataLength: 0,
        }
    }, [preferredPageSize])

    const [pagination, setPagination] = useState<KrisRelatedPagination>(defaultPagination)
    const [currentTabCiType, setCurrentTabCiType] = useState<string>(ENTITY_PROJECT)

    const ciListFilter: CiListFilterContainerUi = useMemo(() => {
        return {
            filter: {
                type: [currentTabCiType],
                metaAttributes: {
                    liableEntity: [neighboursUuid],
                    liableEntityByHierarchy: true,
                    state: showInvalidated ? ['DRAFT', 'INVALIDATED'] : ['DRAFT'],
                },
            },
            page: pagination.pageNumber,
            perpage: pagination.pageSize,
        }
    }, [currentTabCiType, neighboursUuid, pagination.pageNumber, pagination.pageSize, showInvalidated])

    const isCi = currentTabCiType === ENTITY_ISVS || currentTabCiType === ENTITY_PROJECT || currentTabCiType === ENTITY_KS

    const {
        ISVSListData,
        KSListData,
        projectListData,
        isError: isCiTabDataError,
        isLoading: isCiTabDataLoading,
    } = useGetCiTabDataForKris(neighboursUuid)
    const {
        data: ciListData,
        isLoading: isCiListLoading,
        isError: isCiListError,
        isFetching: isCiListFetching,
        fetchStatus: ciListFetchStatus,
    } = useReadCiList1(ciListFilter, { query: { enabled: !!neighboursUuid && isCi } })

    const {
        agendaData,
        zsData,
        isLoading: isAgendaAndZsLoading,
        isError: isAgendaAndZsError,
        isInitialLoading: isInitialAgendaAndZsLoading,
    } = useAgendaAndZsCezPo(neighboursUuid)

    const remmapedAgenda = remmapNameAndValueArrayToObj(agendaData as AgendaAndZsCustomType[])
    const remmapedZsData = remmapNameAndValueArrayToObj(zsData as AgendaAndZsCustomType[])

    const {
        data: listOfCiTypes,
        isLoading: isListOfCiTypeLoading,
        isError: isListOfCiTypesError,
    } = useListCiTypes({ filter: {} }, { query: { queryKey: [CI_TYPES_QUERY_KEY, i18n.language] } })

    const countList = [
        { name: ENTITY_AGENDA, count: agendaData?.length },
        { name: ENTITY_ISVS, count: ISVSListData?.pagination?.totaltems },
        { name: ENTITY_KS, count: KSListData?.pagination?.totaltems },
        { name: ENTITY_PROJECT, count: projectListData?.pagination?.totaltems },
        { name: ENTITY_ZS, count: zsData?.length },
    ]

    const keysToDisplay: KrisKeysToDisplayType[] = krisRelatedCiTabsNames
        .map((key) => {
            const count = countList.find((item) => item.name === key)?.count
            const entity = listOfCiTypes?.results?.find((ci) => ci.technicalName === key)

            return { technicalName: entity?.technicalName ?? '', title: entity?.name ?? '', count }
        })
        .filter((item) => item.technicalName || item.title)

    const isLoading = isCiNeighboursLoading || isListOfCiTypeLoading || isCiTabDataLoading || isInitialAgendaAndZsLoading
    const isListLoading = (isCiListLoading && ciListFetchStatus != 'idle') || isCiListFetching || isAgendaAndZsLoading
    const isError = isCiListError || isCiNeighboursError || isAgendaAndZsError || isListOfCiTypesError || isCiTabDataError

    const handleFilterChange = (pageNumber: number, pageSize: number, krisTabType?: string) => {
        setPagination((prev) => ({ ...prev, pageSize, pageNumber }))
        if (krisTabType) {
            setCurrentTabCiType(krisTabType)
        }
    }

    return (
        <KrisRelatedItemsView
            isError={isError}
            isLoading={isLoading}
            isListLoading={isListLoading}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            data={{ ciListData, projectListData, KSListData, ISVSListData, zsData: remmapedZsData, agendaData: remmapedAgenda }}
            keysToDisplay={keysToDisplay}
            currentTab={currentTabCiType}
        />
    )
}

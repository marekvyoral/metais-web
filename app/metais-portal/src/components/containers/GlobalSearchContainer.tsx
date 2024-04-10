import React, { useEffect, useMemo, useState } from 'react'
import {
    ConfigurationItemElasticItem,
    ElasticItemHolderElasticItemsItem,
    PortalSearch,
    PortalSearchDmsDocumentExtensionsItem,
    PortalSearchResultTypesItem,
    PortalSearchSectionsItem,
    RoleParticipantUI,
    useGetRoleParticipantBulk,
    useSearchAll,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { BASE_PAGE_NUMBER } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GlobalSearchParams } from '@isdd/metais-common/components/navbar/navbar-main/NavSearchBar'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { DateTime } from 'luxon'

import { GlobalSearchViewPagination } from '@/components/views/global-search/GlobalSearchView'
import { DateRanges, IGlobalSearchForm, filterTrueObjectValues, getDateRange } from '@/componentHelpers/global-search'

export type GlobalSearchViewProps = {
    data?: ElasticItemHolderElasticItemsItem[]
    ownerItems?: RoleParticipantUI[]
    isError: boolean
    isLoading: boolean
    pagination?: GlobalSearchViewPagination
}

type GlobalSearch = {
    View: React.FC<GlobalSearchViewProps>
}

const allSections: PortalSearchSectionsItem[] = [
    PortalSearchSectionsItem.EGOV_COMPONENT,
    PortalSearchSectionsItem.STANDARDIZATION,
    PortalSearchSectionsItem.DATA_OBJECTS,
    PortalSearchSectionsItem.SLA_TCO_EKO,
]

const allResultTypes: PortalSearchResultTypesItem[] = [
    PortalSearchResultTypesItem.ATTRIBUTE,
    PortalSearchResultTypesItem.RELATIONSHIP,
    PortalSearchResultTypesItem.DOCUMENT,
]

const allDocTypes: PortalSearchDmsDocumentExtensionsItem[] = [
    PortalSearchDmsDocumentExtensionsItem.PDF,
    PortalSearchDmsDocumentExtensionsItem.DOCX,
    PortalSearchDmsDocumentExtensionsItem.RTF,
    PortalSearchDmsDocumentExtensionsItem.ODT,
]

export const GlobalSearchContainer: React.FC<GlobalSearch> = ({ View }) => {
    const { currentPreferences } = useUserPreferences()
    const [uriParams, setUriParams] = useSearchParams()
    const navigate = useNavigate()

    const [ownerIds, setOwnerIds] = useState<string[]>()

    if (!uriParams.get(GlobalSearchParams.SEARCH)) {
        navigate(RouteNames.HOME)
    }

    const globalSearchParams: PortalSearch = useMemo(() => {
        const filter: IGlobalSearchForm = JSON.parse(uriParams.get('filter') ?? 'null')

        const globalSearchState = currentPreferences.showInvalidatedItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT']
        const currentPage = Number(uriParams.get(GlobalSearchParams.PAGE))
        const currentPageSize = Number(uriParams.get(GlobalSearchParams.PER_PAGE))
        const currentSearchQuery = uriParams.get(GlobalSearchParams.SEARCH)
        const totalItems = Number(uriParams.get(GlobalSearchParams.TOTAL_ITEMS))
        const isOutOfPagination = totalItems ? currentPage * currentPageSize > totalItems + currentPageSize : false
        const sections =
            filter && filter.sections && filterTrueObjectValues(filter.sections).length > 0 ? filterTrueObjectValues(filter.sections) : allSections
        const resultTypes =
            filter && filter.resultTypes && filterTrueObjectValues(filter.resultTypes).length > 0
                ? filterTrueObjectValues(filter.resultTypes)
                : allResultTypes
        const docTypes =
            filter && filter.docTypes && filterTrueObjectValues(filter.docTypes).length > 0 ? filterTrueObjectValues(filter.docTypes) : allDocTypes
        if (isOutOfPagination) {
            const currentLastPage = (totalItems + currentPageSize) / currentPageSize ?? BASE_PAGE_NUMBER
            setUriParams((prevSearchParams) => {
                const newSearchParams = new URLSearchParams(prevSearchParams)
                newSearchParams.set(GlobalSearchParams.PAGE, Math.trunc(currentLastPage).toString())
                return newSearchParams
            })
        }

        const { lastModifiedAtFrom, lastModifiedAtTo } =
            filter && filter.dateRange && filter.dateRange !== DateRanges.CUSTOM_RANGE
                ? getDateRange(filter.dateRange)
                : {
                      lastModifiedAtFrom: filter?.fromUpdate
                          ? new Date(filter?.fromUpdate).toISOString()
                          : DateTime.utc(1900).startOf('day').toISO() ?? '',
                      lastModifiedAtTo: filter?.toUpdate
                          ? DateTime.fromJSDate(new Date(filter?.toUpdate)).toUTC().endOf('day').toISO() ?? ''
                          : DateTime.utc().endOf('day').toISO() ?? '',
                  }

        return {
            text: currentSearchQuery ?? '',
            lastModifiedAtFrom: lastModifiedAtFrom,
            lastModifiedAtTo: lastModifiedAtTo,
            resultTypes: resultTypes,
            sections: sections,
            poUuid: filter && filter.owner ? filter.owner : undefined,
            dmsDocumentExtensions: docTypes,
            states: globalSearchState,
            usageTypeFilter: undefined,
            pagination: { page: currentPage, perPage: currentPageSize },
        }
    }, [currentPreferences.showInvalidatedItems, setUriParams, uriParams])

    const {
        data: searchData,
        isError,
        isLoading,
        isFetching,
    } = useSearchAll(globalSearchParams, { query: { enabled: uriParams.get(GlobalSearchParams.SEARCH) ? true : false } })

    const {
        data: owners,
        isFetching: isGestorsLoading,
        isError: isGestorsError,
    } = useGetRoleParticipantBulk(
        { gids: [...new Set(ownerIds)] },
        {
            query: {
                enabled: !!ownerIds && ownerIds.length > 0,
            },
        },
    )

    useEffect(() => {
        if (searchData && searchData.elasticItems && searchData.elasticItems?.length > 0)
            setOwnerIds(searchData?.elasticItems?.map((item: ConfigurationItemElasticItem) => item?.owner ?? ''))
        else setOwnerIds(undefined)
    }, [searchData])

    return (
        <View
            data={searchData?.elasticItems}
            ownerItems={owners}
            isError={isError || isGestorsError}
            isLoading={isLoading || isFetching || isGestorsLoading}
            pagination={searchData?.pagination as GlobalSearchViewPagination}
        />
    )
}

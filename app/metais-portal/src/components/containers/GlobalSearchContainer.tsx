import React, { useMemo } from 'react'
import { GeneralElasticItemSet, SearchAllParams, useSearchAll } from '@isdd/metais-common/api'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { GlobalSearchParams } from '@isdd/metais-common/components/navbar/navbar-main/NavSearchBar'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

export type GlobalSearchViewProps = {
    data?: GeneralElasticItemSet
    isError: boolean
    isLoading: boolean
}

type GlobalSearch = {
    View: React.FC<GlobalSearchViewProps>
}

export const GlobalSearchContainer: React.FC<GlobalSearch> = ({ View }) => {
    const { currentPreferences } = useUserPreferences()
    const [uriParams, setUriParams] = useSearchParams()
    const navigate = useNavigate()

    if (!uriParams.get(GlobalSearchParams.SEARCH)) {
        navigate(RouteNames.HOME)
    }

    const globalSearchParams: SearchAllParams = useMemo(() => {
        const globalSearchState = currentPreferences.showInvalidatedItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT']
        const currentPage = Number(uriParams.get(GlobalSearchParams.PAGE))
        const currentPageSize = Number(uriParams.get(GlobalSearchParams.PER_PAGE))
        const currentSearchQuery = uriParams.get(GlobalSearchParams.SEARCH)
        const totalItems = Number(uriParams.get(GlobalSearchParams.TOTAL_ITEMS))
        const isOutOfPagination = totalItems ? currentPage * currentPageSize > totalItems + currentPageSize : false

        if (isOutOfPagination) {
            const currentLastPage = (totalItems + currentPageSize) / currentPageSize ?? BASE_PAGE_NUMBER
            setUriParams((prevSearchParams) => {
                const newSearchParams = new URLSearchParams(prevSearchParams)
                newSearchParams.set(GlobalSearchParams.PAGE, Math.trunc(currentLastPage).toString())
                return newSearchParams
            })
        }

        return {
            text: currentSearchQuery ?? '',
            page: currentPage ?? BASE_PAGE_NUMBER,
            perPage: currentPageSize ?? BASE_PAGE_SIZE,
            state: globalSearchState,
        }
    }, [currentPreferences.showInvalidatedItems, setUriParams, uriParams])

    const { data: searchData, isError, isFetching, isFetched, isLoading } = useSearchAll(globalSearchParams)

    return <View data={searchData} isError={isError} isLoading={!isFetched && (isLoading || isFetching)} />
}

import { Pagination, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { GetAllLocale, useGetAll } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useCallback, useEffect } from 'react'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import { LocalizationFilterMap, SecondLanguage, getPagination } from '@/componentHelpers/localization'

const defaultPagination: Pagination = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

type GetAllLocalesProps = {
    defaultFilterValues: LocalizationFilterMap
}

export const useGetAllLocales = ({ defaultFilterValues }: GetAllLocalesProps) => {
    const { filter, handleFilterChange } = useFilterParams<LocalizationFilterMap & IFilter & { fullTextSearch?: string }>(defaultFilterValues)

    const getLocaleLanguage = (): [GetAllLocale, SecondLanguage] => {
        if (filter.language && filter.language === 'ALL') {
            return ['SK', 'EN']
        }
        return [filter.language, null]
    }
    const [firstLanguage, secondLanguage] = getLocaleLanguage()
    const shouldDisplayBothLanguages = !!secondLanguage

    type SortOrder = ['key' | 'value', 'asc' | 'desc'] | undefined
    const getSorting = useCallback((): SortOrder | undefined => {
        const orderBy = filter.sort?.[0]?.orderBy
        const sortDirection = filter.sort?.[0]?.sortDirection

        if (orderBy && sortDirection) {
            const getSortDirection = (dir: SortType): 'asc' | 'desc' => {
                switch (dir) {
                    case SortType.ASC:
                        return 'asc'
                    case SortType.DESC:
                        return 'desc'
                    default:
                        return 'asc'
                }
            }

            const getOrderBy = (order: string): 'key' | 'value' => {
                if (order != 'key' && order != 'value') {
                    return 'value'
                }
                return order
            }
            return [getOrderBy(orderBy), getSortDirection(sortDirection)]
        }
        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.sort?.[0]?.orderBy, filter.sort?.[0]?.sortDirection])

    //fetch for SK or single variant
    const { data, isError, isLoading, fetchStatus, isFetching, refetch } = useGetAll(
        {
            locale: firstLanguage ?? 'SK',
            userInterface: filter?.type ?? 'PORTAL',
            ...(getSorting() ? { sort: getSorting() } : {}),
        },
        { query: { enabled: !!filter.language && !!firstLanguage } },
    )
    //GET ALL FOR EN varian
    const {
        data: secondData,
        isError: isSecondError,
        isLoading: isSecondLoading,
        fetchStatus: fetchStatusSecond,
        isFetching: isSecondFetching,
        refetch: refetchSecond,
    } = useGetAll(
        {
            locale: secondLanguage ?? 'EN',
            userInterface: filter?.type ?? 'PORTAL',
            ...(getSorting() ? { sort: getSorting() } : {}),
        },
        { query: { enabled: !!filter.language && filter.language === 'ALL' && !!secondLanguage } },
    )

    useEffect(() => {
        if (shouldDisplayBothLanguages) {
            refetch()
            refetchSecond()
        }
    }, [refetch, refetchSecond, shouldDisplayBothLanguages])

    const filterTranslations = (search: string, skData: Record<string, string>, enData: Record<string, string>) => {
        const filteredSK: Record<string, string> = {}
        const filteredEN: Record<string, string> = {}

        const searchLower = latiniseString(search)

        Object.keys(skData).forEach((key) => {
            const keyLower = latiniseString(key)
            const skValueLower = latiniseString(skData[key])
            const enValueLower = latiniseString(enData[key])

            if (keyLower.includes(searchLower) || skValueLower.includes(searchLower) || enValueLower.includes(searchLower)) {
                filteredSK[key] = skData[key]
                filteredEN[key] = enData[key]
            }
        })

        return [filteredSK, filteredEN]
    }

    const [filteredSK, filteredEN] = filterTranslations(filter.fullTextSearch ?? '', data ?? {}, secondData ?? {})

    const pagination = getPagination(
        filter.pageNumber ?? defaultPagination.pageNumber,
        filter.pageSize ?? defaultPagination.pageSize,
        Object.keys(filteredSK)?.length || defaultPagination.dataLength,
    )

    return {
        handleFilterChange,
        data: filteredSK,
        secondData: filteredEN,
        isError: isError || isSecondError,
        isLoading: ((isLoading || isFetching) && fetchStatus != 'idle') || ((isSecondLoading || isSecondFetching) && fetchStatusSecond != 'idle'),
        pagination,
        localeLanguage: getLocaleLanguage(),
        userInterface: filter.type,
        sort: filter.sort,
    }
}

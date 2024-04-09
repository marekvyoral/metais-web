import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { EkoCodeList, useDeleteHrEkoCode, useGetEkoCodes, useUpdateHrEkoCode } from '@isdd/metais-common/api/generated/tco-swagger'
import { ADMIN_EKO_LIST_QKEY, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

export interface IFilterData extends IFilterParams, IFilter {
    isActive?: boolean
}
export interface IView {
    defaultFilterParams: IFilterData
    data?: void | EkoCodeList | undefined
    handleFilterChange: (filter: IFilter) => void
    invalidateCodes: (ekoCodes: EkoCodeList) => Promise<void>
    deleteCodes: (ekoCodes: EkoCodeList) => Promise<void>
    isLoading: boolean
    isError: boolean
}

export interface IEkoListContainerProps {
    View: React.FC<IView>
}

export const EkoListContainer: React.FC<IEkoListContainerProps> = ({ View }) => {
    const { currentPreferences } = useUserPreferences()
    const queryClient = useQueryClient()
    const defaultSort = [
        {
            orderBy: 'ekoCode',
            sortDirection: SortType.ASC,
        },
    ]
    const { filter, handleFilterChange } = useFilterParams<IFilterData>({
        sort: defaultSort,
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: Number(currentPreferences.defaultPerPage) || BASE_PAGE_SIZE,
    })

    const { mutateAsync } = useDeleteHrEkoCode({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EKO_LIST_QKEY])
            },
        },
    })
    const { mutateAsync: updateMutateAsync } = useUpdateHrEkoCode({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EKO_LIST_QKEY])
            },
        },
    })

    const { data, isLoading, isError } = useGetEkoCodes({
        sortBy: filter?.sort?.at(0)?.orderBy,
        ascending: filter?.sort?.at(0)?.sortDirection === SortType.ASC,
    })

    const invalidateCodes = async (ekoCodes: EkoCodeList) => {
        await updateMutateAsync({
            data: {
                ...ekoCodes,
            },
        })
    }

    const deleteCodes = async (ekoCodes: EkoCodeList) => {
        await mutateAsync({
            data: {
                ...ekoCodes,
            },
        })
    }

    return (
        <View
            data={data}
            deleteCodes={deleteCodes}
            invalidateCodes={invalidateCodes}
            defaultFilterParams={filter}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}

import React, { useEffect, useState } from 'react'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useReadCiList1, useResetUserColumns, useGetUserColumns, useGetDefaultColumns, useInsertUserColumns } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

import { IListView } from '@/types/list'
import { mapFilterParamsToApi, mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapConfigurationItemSetToPagination } from '@/componentHelpers/pagination'

interface ICiListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView>
    defaultFilterValues: T
}

export const CiListContainer = <T extends FieldValues & IFilterParams>({ entityName, ListComponent, defaultFilterValues }: ICiListContainer<T>) => {
    const { filter: filterParams, handleFilterChange } = useFilterParams<T & IFilter>({
        sort: [{ orderBy: 'Gen_Profil_nazov', sortDirection: SortType.ASC }],
        ...defaultFilterValues,
    })

    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user

    const getUserColumns = useGetUserColumns(entityName, { query: { enabled: isUserLogged } })
    const getDefaultColumns = useGetDefaultColumns(entityName, { query: { enabled: !isUserLogged } })

    const {
        data: columnListData,
        refetch: refetchColumnData,
        isLoading: isQueryLoading,
        isError: isQueryError,
    } = isUserLogged ? getUserColumns : getDefaultColumns

    const storeUserSelectedColumns = useInsertUserColumns()
    const { isLoading: isStoreLoading, isError: isStoreError } = storeUserSelectedColumns
    const saveColumnSelection = async (columnSelection: {
        attributes: { name: string; order: number }[]
        metaAttributes: { name: string; order: number }[]
    }) => {
        await storeUserSelectedColumns.mutateAsync({
            data: {
                attributes: columnSelection.attributes,
                ciType: entityName ?? '',
                metaAttributes: columnSelection.metaAttributes,
            },
        })
        await refetchColumnData()
    }

    const resetUserSelectedColumns = useResetUserColumns()
    const { isLoading: isResetLoading, isError: isResetError } = resetUserSelectedColumns
    const resetColumns = async () => {
        await resetUserSelectedColumns.mutateAsync({ citype: entityName || '' })
        await refetchColumnData()
    }

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    }
    const filterToNeighborsApi = mapFilterToNeighborsApi(filterParams, defaultRequestApi)
    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
        },
    })

    //so there is always dataLength == pagination wont disappear and total items wont go on page change to zero
    const [dataLength, setDataLength] = useState(0)
    useEffect(() => {
        if (tableData?.pagination?.totaltems) {
            setDataLength(tableData?.pagination?.totaltems)
        }
    }, [tableData?.pagination?.totaltems])
    const pagination = mapConfigurationItemSetToPagination(filterParams, dataLength)

    const isLoading = [isQueryLoading, isReadCiListLoading, isResetLoading, isStoreLoading].some((item) => item)
    const isError = [isQueryError, isReadCiListError, isResetError, isStoreError].some((item) => item)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <ListComponent
                data={{ columnListData, tableData }}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                resetUserSelectedColumns={resetColumns}
                storeUserSelectedColumns={saveColumnSelection}
                sort={filterParams?.sort ?? []}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}

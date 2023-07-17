import React from 'react'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues } from 'react-hook-form'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'

import {
    useReadCiListUsingPOST,
    useResetUserColumnsUsingDELETE,
    useGetUserColumnsUsingGET,
    useGetDefaultColumnsUsingGET,
    useInsertUserColumnsUsingPOST,
} from '@/api'
import { IListView } from '@/types/list'
import { mapFilterParamsToApi, mapFilterToNeighborsApi } from '@/componentHelpers'
import { mapConfigurationItemSetToPagination } from '@/componentHelpers/pagination'
import { useAuth } from '@/contexts/auth/authContext'

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

    const getUserColumns = useGetUserColumnsUsingGET(entityName, { query: { enabled: isUserLogged } })
    const getDefaultColumns = useGetDefaultColumnsUsingGET(entityName, { query: { enabled: !isUserLogged } })

    const { data: columnListData, refetch: refetchColumnData } = isUserLogged ? getUserColumns : getDefaultColumns

    const storeUserSelectedColumns = useInsertUserColumnsUsingPOST()
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

    const resetUserSelectedColumns = useResetUserColumnsUsingDELETE()
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
    const { data: tableData } = useReadCiListUsingPOST({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
        },
    })

    const pagination = mapConfigurationItemSetToPagination(filterParams, tableData)

    return (
        <ListComponent
            data={{ columnListData, tableData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            sort={filterParams?.sort ?? []}
        />
    )
}

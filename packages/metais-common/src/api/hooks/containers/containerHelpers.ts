import { IFilter, SortType } from '@isdd/idsk-ui-kit/src/types'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'

import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    FavoriteCiType,
    useGetDefaultColumns,
    useGetUserColumns,
    useInsertUserColumns,
    useResetUserColumns,
} from '@isdd/metais-common/api/generated/user-config-swagger'
import { mapConfigurationItemSetToPagination } from '@isdd/metais-common/componentHelpers/pagination'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'

export const useGetColumnData = (entityName: string) => {
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
    const saveColumnSelection = async (columnSelection: FavoriteCiType) => {
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
    const isLoading = [isQueryLoading, isResetLoading, isStoreLoading].some((item) => item)
    const isError = [isQueryError, isResetError, isStoreError].some((item) => item)

    return {
        columnListData,
        saveColumnSelection,
        resetColumns,
        isLoading,
        isError,
    }
}

export const useFilterForCiList = <T extends FieldValues & IFilterParams>(defaultFilterValues: T, entityName: string) => {
    const { filter: filterParams, handleFilterChange } = useFilterParams<T & IFilter>({
        sort: [{ orderBy: 'Gen_Profil_nazov', sortDirection: SortType.ASC }],
        ...defaultFilterValues,
    })

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    }
    const filterToNeighborsApi = mapFilterToNeighborsApi(filterParams, defaultRequestApi)

    return {
        filterParams,
        handleFilterChange,
        filterToNeighborsApi,
    }
}

export const usePagination = <T>(tableData: ConfigurationItemSetUi | undefined, filterParams: T & IFilter) => {
    //so there is always dataLength == pagination wont disappear and total items wont go on page change to zero
    const [dataLength, setDataLength] = useState(0)
    useEffect(() => {
        if (tableData?.pagination?.totaltems) {
            setDataLength(tableData?.pagination?.totaltems)
        }
    }, [tableData?.pagination?.totaltems])
    const pagination = mapConfigurationItemSetToPagination(filterParams, dataLength)

    return pagination
}

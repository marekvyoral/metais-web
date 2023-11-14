import { ConfigurationItemUiAttributes, useInvalidateConfigurationItem, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IListView } from '@isdd/metais-common/types/list'
import React from 'react'
import { FieldValues } from 'react-hook-form'
export interface IActions {
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => Promise<void>
}

interface IPublicAuthoritiesListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView & IActions>
    defaultFilterValues: T
    entityId?: string
}

export const PublicAuthoritiesListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    ListComponent,
    defaultFilterValues,
    entityId,
}: IPublicAuthoritiesListContainer<T>) => {
    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)
    const { currentPreferences } = useUserPreferences()

    const metaAttributes = currentPreferences.showInvalidatedItems
        ? { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER', 'INVALIDATED'] }
        : { state: ['DRAFT', 'AWAITING_APPROVAL', 'APPROVED_BY_OWNER'] }

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes,
            poUuid: entityId,
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, defaultRequestApi)

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
        refetch,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
        },
    })

    const pagination = usePagination(tableData, filterParams)

    const { mutateAsync: setInvalid } = useInvalidateConfigurationItem()

    const InvalidateConfigurationItem = async (uuid: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => {
        if (!configurationItem) return
        await setInvalid({
            data: {
                attributes: Object.keys(configurationItem).map((key) => ({ value: configurationItem?.[key], name: key })),
                invalidateReason: { comment: '' },
                type: 'PO',
                uuid: uuid,
            },
        })
    }

    const isLoading = [isReadCiListLoading, isColumnsLoading].some((item) => item)
    const isError = [isReadCiListError, isColumnsError].some((item) => item)

    return (
        <ListComponent
            data={{ columnListData, tableData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            sort={filterParams?.sort ?? []}
            refetch={refetch}
            isLoading={isLoading}
            isError={isError}
            setInvalid={InvalidateConfigurationItem}
        />
    )
}

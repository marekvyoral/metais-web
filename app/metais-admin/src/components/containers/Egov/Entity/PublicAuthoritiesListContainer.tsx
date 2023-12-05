import { ConfigurationItemUiAttributes, useInvalidateConfigurationItem, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IListView } from '@isdd/metais-common/types/list'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useIsIdentityAssignedToPOHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
export interface IActions {
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => Promise<void>
}

interface IPublicAuthoritiesListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView & IActions>
    defaultFilterValues: T
    entityId?: string
    setIsInvalidateError: Dispatch<SetStateAction<boolean>>
}

export const PublicAuthoritiesListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    ListComponent,
    defaultFilterValues,
    entityId,
    setIsInvalidateError,
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

    const { mutateAsync: setInvalid, isLoading: isInvalidating, isError: isInvalidateError } = useInvalidateConfigurationItem()
    const isAssignToPOHook = useIsIdentityAssignedToPOHook()

    const [isCheckError, setIsCheckError] = useState(false)

    const { setIsActionSuccess } = useActionSuccess()
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading, isTooManyFetchesError } = useGetStatus()

    const onCreateSuccess = () => {
        refetch()
        setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}` })
    }

    useEffect(() => {
        setIsInvalidateError([isCheckError, isProcessedError, isInvalidateError].some((item) => item))
    }, [isCheckError, isInvalidateError, isProcessedError, setIsInvalidateError])

    const invalidateConfigurationItem = async (uuid: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => {
        if (!configurationItem) return
        await isAssignToPOHook(uuid ?? '')
            .then((res) => {
                if (!res) {
                    setInvalid({
                        data: {
                            attributes: Object.keys(configurationItem).map((key) => ({ value: configurationItem?.[key], name: key })),
                            invalidateReason: { comment: '' },
                            type: 'PO',
                            uuid: uuid,
                        },
                    }).then((invalidRes) => getRequestStatus(invalidRes.requestId ?? '', onCreateSuccess))
                }
            })
            .catch(() => {
                setIsCheckError(true)
            })
    }

    const isLoading = [isReadCiListLoading, isColumnsLoading, isRedirectLoading].some((item) => item)
    const isError = [isReadCiListError, isColumnsError, isProcessedError, isRedirectError, isTooManyFetchesError].some((item) => item)

    return (
        <ListComponent
            data={{ columnListData, tableData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            sort={filterParams?.sort ?? []}
            refetch={refetch}
            isLoading={isLoading || isInvalidating}
            isError={isError}
            setInvalid={invalidateConfigurationItem}
        />
    )
}

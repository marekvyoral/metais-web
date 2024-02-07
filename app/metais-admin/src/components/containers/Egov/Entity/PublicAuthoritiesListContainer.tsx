import {
    ConfigurationItemUiAttributes,
    useInvalidateConfigurationItem,
    useReadCiList1,
    useRecycleInvalidatedCisBiznis,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IListView } from '@isdd/metais-common/types/list'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useIsIdentityAssignedToPOHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers'
export interface IActions {
    setInvalid?: (entityId: string | undefined, configurationItem: ConfigurationItemUiAttributes | undefined) => Promise<void>
    setValid?: (ciIds: string[] | undefined) => Promise<void>
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
    const metaAttributesStates = ['AWAITING_APPROVAL', 'APPROVED_BY_OWNER']

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes: { state: metaAttributesStates },
            poUuid: entityId,
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, defaultRequestApi)

    const getStates = (state: string): string[] => {
        switch (state) {
            case 'DRAFT':
                return [...metaAttributesStates, 'DRAFT']
            case 'INVALIDATED':
                return [...metaAttributesStates, 'INVALIDATED']
            default:
                return [...metaAttributesStates, 'DRAFT', 'INVALIDATED']
        }
    }

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isFetching: isFetching,
        isError: isReadCiListError,
        refetch,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams),
            metaAttributes: {
                state: getStates(filterParams.state) ?? [],
            },
        },
    })

    const { setIsActionSuccess } = useActionSuccess()
    const pagination = usePagination(tableData, filterParams)
    const { getRequestStatus, isProcessedError, isError: isRedirectError, isLoading: isRedirectLoading, isTooManyFetchesError } = useGetStatus()
    const onCreateSuccess = () => {
        refetch()
        setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}`, additionalInfo: { type: 'invalid' } })
    }

    const onValidSuccess = () => {
        refetch()
        setIsActionSuccess({ value: true, path: `${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}`, additionalInfo: { type: 'valid' } })
    }
    const {
        mutateAsync: setInvalid,
        isLoading: isInvalidating,
        isError: isInvalidateError,
    } = useInvalidateConfigurationItem({
        mutation: {
            onSuccess: (data) => {
                getRequestStatus(data.requestId ?? '', onCreateSuccess)
            },
            onError: () => {
                setIsActionSuccess({ value: false, path: `${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}`, additionalInfo: { type: 'invalid' } })
            },
        },
    })
    const { mutateAsync: setValid, isLoading: isValidLoading } = useRecycleInvalidatedCisBiznis({
        mutation: {
            onSuccess: (data) => {
                getRequestStatus(data.requestId ?? '', onValidSuccess)
            },
            onError: () => {
                setIsActionSuccess({ value: false, path: `${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}`, additionalInfo: { type: 'valid' } })
            },
        },
    })
    const isAssignToPOHook = useIsIdentityAssignedToPOHook()

    const [isCheckError, setIsCheckError] = useState(false)

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

    const validatePO = async (uuids: string[] | undefined) => {
        await setValid({ data: { ciIdList: uuids } })
    }

    const isLoading = [isReadCiListLoading, isColumnsLoading, isRedirectLoading, isValidLoading].some((item) => item)
    const isError = [isReadCiListError, isColumnsError, isProcessedError, isRedirectError, isTooManyFetchesError].some((item) => item)

    return (
        <ListComponent
            data={{
                columnListData,
                tableData,
            }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            sort={filterParams?.sort ?? []}
            refetch={refetch}
            isLoading={[isLoading, isInvalidating, isFetching].some((item) => item)}
            isError={isError}
            setInvalid={invalidateConfigurationItem}
            setValid={validatePO}
        />
    )
}

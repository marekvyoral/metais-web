import { ApiError, ConfigurationItemUi, useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumItem, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { OwnerByGidOutput, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiParameterType,
    ApiSlaParameterRead,
    ApiSlaParameterReadList,
    ApiSlaParameterWrite,
    useGetSlaParameterHook,
    useListParameterTypes,
    useListParameterTypes1,
    useUpdateSlaParams,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import React from 'react'

export interface IView {
    entityName: string
    parametersList: ApiSlaParameterRead[]
    parameterTypes: ApiParameterType[]
    ci?: ConfigurationItemUi
    valueTypes?: EnumItem[]
    valueUnitsEnum?: EnumItem[]
    valueTypesEnum?: EnumItem[]
    plannedAccessTimeEnum?: EnumItem[]
    isLoading: boolean
    isError: boolean
    slaId: string
    refetchParameterList: <TPageData>(
        options?: RefetchOptions & RefetchQueryFilters<TPageData>,
    ) => Promise<QueryObserverResult<ApiSlaParameterReadList, ApiError>>
    updateParam: (item: ApiSlaParameterWrite) => Promise<void>
    isOwnerByGid?: OwnerByGidOutput
    getSlaById: (slaParamUuid: string, signal?: AbortSignal) => Promise<ApiSlaParameterRead>
    invalidateSla: (uuid: string) => Promise<void>
    isUpdateError: boolean
}

interface ISlaDetailContainer {
    View: React.FC<IView>
    entityName: string
    paramType: string
    serviceId: string
    slaId: string
}

export const SlaDetailContainer: React.FC<ISlaDetailContainer> = ({ View, entityName, paramType, serviceId, slaId }) => {
    const {
        data: parameterTypes,
        isLoading: isParametersTypesLoading,
        isError: isParametersTypesError,
    } = useListParameterTypes1({
        category: paramType,
        ignoreNonActual: false,
        page: 1,
        perPageSize: 10000,
    })
    const getSlaById = useGetSlaParameterHook()
    const {
        data: parametersList,
        isFetching: isParametersListLoading,
        isError: isParametersListError,
        refetch: refetchParameterList,
    } = useListParameterTypes({
        serviceType: entityName,
        services: [serviceId],
        ignoreNonActual: false,
        perPageSize: 10000,
    })
    const { data: ci, isLoading: ciLoading } = useReadConfigurationItem(serviceId)
    const { data: valueTypesEnum, isLoading: isValueTypesLoading } = useGetEnum('TYP_HODNOTY')
    const { data: valueUnitsEnum, isLoading: isParamUnitTypesLoading } = useGetEnum('TYP_PARAMETROV_JEDNOTKA')
    const { data: plannedAccessTimeEnum, isLoading: isPlannedAccessTimeLoading } = useGetEnum('PLANOVANA_DOBA_DOSTUPNOSTI')

    const {
        mutateAsync: updateSLAParams,
        isLoading: isUpdateLoading,
        isError: isUpdateError,
    } = useUpdateSlaParams({
        mutation: {
            onSettled: () => {
                refetchParameterList()
            },
        },
    })

    const {
        state: { user, token },
    } = useAuth()
    const {
        data: isOwnerByGid,
        isFetching: isOwnerByGidLoading,
        isError: isOwnerByGidError,
    } = useIsOwnerByGid(
        {
            gids: [ci?.metaAttributes?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !ciLoading && token !== null && !!user } },
    )

    const invalidateSla = async (uuid: string) => {
        const sla = await getSlaById(uuid)
        sla && updateSLAParams({ data: [{ ...sla, isValid: false }] })
    }

    return (
        <View
            isUpdateError={isUpdateError}
            invalidateSla={invalidateSla}
            getSlaById={getSlaById}
            isOwnerByGid={isOwnerByGid}
            plannedAccessTimeEnum={plannedAccessTimeEnum?.enumItems}
            updateParam={(value) => updateSLAParams({ data: [value] })}
            valueTypesEnum={valueTypesEnum?.enumItems}
            refetchParameterList={refetchParameterList}
            valueUnitsEnum={valueUnitsEnum?.enumItems}
            slaId={slaId}
            entityName={entityName}
            parametersList={parametersList?.results ?? []}
            valueTypes={valueTypesEnum?.enumItems}
            parameterTypes={parameterTypes?.results ?? []}
            ci={ci}
            isLoading={
                isParametersListLoading ||
                isParametersTypesLoading ||
                isValueTypesLoading ||
                isParamUnitTypesLoading ||
                isPlannedAccessTimeLoading ||
                isOwnerByGidLoading ||
                isUpdateLoading
            }
            isError={isParametersListError || isParametersTypesError || isOwnerByGidError || isUpdateError}
        />
    )
}

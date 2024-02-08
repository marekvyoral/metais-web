import { IFilter } from '@isdd/idsk-ui-kit/types'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import {
    ApiParameterTypesList,
    MonitoredValue,
    useAddParameterValuesHook,
    useListParameterTypes1,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { ENTITY_AS } from '@isdd/metais-common/constants'

import { IQueryParamsDetail } from '@/pages/monitoring/services/monitoras/[serviceUuid]'

export interface MonitoringDetailFilterData extends IFilterParams, FieldValues, IFilterParams, IFilter {
    dateFrom?: string
    dateTo?: string
    serviceType?: string
    owner?: string
    project?: string
    isvs?: string
    service?: string
    serviceUuid?: string
}

export interface IValueParam {
    id: number
    description: string
    name: string
    value: string
    unit: string
    paramType: number
    dateFrom: Date
}

export interface IInsertMonitoringView {
    paramTypeData?: ApiParameterTypesList
    filterParams: MonitoringDetailFilterData
    defaultFilterValues: MonitoringDetailFilterData
    handleAddParams: (data: IValueParam[]) => void
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    queryParams?: IQueryParamsDetail
    tableDataParam?: EnumType
}

interface IMonitoringServiceInsertContainer {
    View: React.FC<IInsertMonitoringView>
    defaultFilterValues: MonitoringDetailFilterData
    queryParams?: IQueryParamsDetail
}

export const MonitoringServiceInsertContainer: React.FC<IMonitoringServiceInsertContainer> = ({ View, defaultFilterValues, queryParams }) => {
    const [isLoadingApi, setIsLoadingApi] = useState(false)
    const [isErrorApi, setIsErrorApi] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const { filter, handleFilterChange } = useFilterParams<MonitoringDetailFilterData>({
        ...defaultFilterValues,
        serviceUuid: queryParams?.serviceUuid ?? '',
    })
    const addParamsHook = useAddParameterValuesHook()

    const {
        data: paramTypeData,
        isLoading: isLoadingPar,
        isError: isErrorPar,
    } = useListParameterTypes1({
        category: defaultFilterValues.serviceType === ENTITY_AS ? 'c_typ_parametra_kategoria.1' : 'c_typ_parametra_kategoria.2',
    })

    const { data: tableDataParam, isLoading: isLoadingParam, isError: isErrorParam } = useGetValidEnum('TYP_PARAMETROV_JEDNOTKA')

    const startOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1)
    }

    const endOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }

    const handleAddParams = (data: IValueParam[]) => {
        setIsLoadingApi(true)
        const mappedData = data.map((item) => {
            return {
                entityReferenceType: defaultFilterValues.serviceType,
                entityReferenceId: queryParams?.serviceUuid,
                value: item.value,
                parameterType: {
                    id: item.paramType,
                },
                monitoredInterval: {
                    start: formatDateForDefaultValue(startOfMonth(item.dateFrom).toISOString(), "yyyy-MM-dd'T'00:00:00.000+0100"),
                    end: formatDateForDefaultValue(endOfMonth(item.dateFrom).toISOString(), "yyyy-MM-dd'T'00:00:00.000+0100"),
                },
            } as MonitoredValue
        })

        setIsErrorApi(false)
        addParamsHook(mappedData)
            .then(() => {
                setSuccess(true)
            })
            .catch(() => {
                setIsErrorApi(true)
            })
            .finally(() => {
                setIsLoadingApi(false)
            })
    }

    const isLoading = [isLoadingPar, isLoadingParam, isLoadingApi].some((item) => item)
    const isError = [isErrorPar, isErrorParam, isErrorApi].some((item) => item)

    return (
        <View
            filterParams={filter}
            defaultFilterValues={defaultFilterValues}
            handleFilterChange={handleFilterChange}
            handleAddParams={handleAddParams}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            paramTypeData={paramTypeData}
            queryParams={queryParams}
            tableDataParam={tableDataParam}
        />
    )
}

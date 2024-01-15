import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ConfigurationItemUi, useReadCiList1, useReadNeighboursConfigurationItems } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumItem, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ApiParameterTypesList,
    ApiSlaParameterReadList,
    useListParameterTypes,
    useListParameterTypes1,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { transformAttributesKeyValue } from '@isdd/metais-common/api/hooks/transform'
import { TYP_HODNOTY, TYP_PARAMETROV_JEDNOTKA } from '@isdd/metais-common/api/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useEffect, useState } from 'react'
import { MultiValue } from 'react-select'
import { categoryParameterMap } from '@isdd/metais-common/constants'

export interface SlaParamsListFilterData extends IFilterParams, IFilter {
    perPageSize?: number
    paramType?: string
    page?: number
    ignoreNonActual?: string
    services: string[]
    valueType?: string
}

export interface IView {
    data?: ApiSlaParameterReadList
    filter: SlaParamsListFilterData
    handleFilterChange: (changedFilter: IFilter) => void
    selectedItems: MultiValue<ConfigurationItemUi>
    setSelectedItems: React.Dispatch<React.SetStateAction<MultiValue<ConfigurationItemUi>>>
    isLoading: boolean
    isError: boolean
    entityName: string
    dataParamTypes?: ApiParameterTypesList
    defaultFilterValues: SlaParamsListFilterData
    valueTypesOptions: {
        value: string
        label: string
    }[]
    valueUnitsOptions?: EnumItem[]
    selectedISVS?: ConfigurationItemUi
    setSelectedISVS: React.Dispatch<React.SetStateAction<ConfigurationItemUi | undefined>>
    neighborsISVS?: ConfigurationItemUi[]
}

interface ISlaParamsListContainer {
    View: React.FC<IView>
    entityName: string
}

export const SlaParamsListContainer: React.FC<ISlaParamsListContainer> = ({ View, entityName }) => {
    const defaultFilterValues: SlaParamsListFilterData = {
        services: [],
        ignoreNonActual: 'true',
        valueType: '',
        paramType: '',
        sort: [{ orderBy: 'serviceName', sortDirection: SortType.ASC }],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    }

    const [selectedItems, setSelectedItems] = useState<MultiValue<ConfigurationItemUi>>([])
    const [selectedISVS, setSelectedISVS] = useState<ConfigurationItemUi>()
    const [neighborsISVS, setNeighborsISVS] = useState<ConfigurationItemUi[]>()
    const { filter, handleFilterChange } = useFilterParams<SlaParamsListFilterData>(defaultFilterValues)

    //Enums
    const { data: valueTypesEnum, isLoading: isValueTypesLoading } = useGetEnum(TYP_HODNOTY)
    const valueTypesOptions = valueTypesEnum?.enumItems?.filter((i) => i.valid).map((i) => ({ value: i.code ?? '', label: i.value ?? '' })) ?? []
    const { data: valueUnitsEnum, isLoading: isParamUnitTypesLoading } = useGetEnum(TYP_PARAMETROV_JEDNOTKA)

    //Filter load multi lazy options
    const { data: services } = useReadCiList1({ filter: { uuid: filter.services } }, { query: { enabled: !!filter.services } })
    useEffect(() => {
        if (services && filter.services && selectedItems && filter.services.length != 0 && selectedItems.length == 0) {
            setSelectedItems(services?.configurationItemSet ?? [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [services])

    useEffect(() => {
        if (filter.services && filter.services.length == 0) {
            setSelectedItems([])
            setSelectedISVS(undefined)
        }
    }, [filter.services])

    //Filter param types
    const {
        isLoading: isLoadingParamTypes,
        isError: isErrorParamTypes,
        data: dataParamTypes,
    } = useListParameterTypes1({ category: categoryParameterMap.get(entityName), ignoreNonActual: false, page: 1, perPageSize: 10000 })

    //For AS selected ISVS
    const { data: neighborsISVSRaw, isFetching: isNeighborsISVSLoading } = useReadNeighboursConfigurationItems(
        selectedISVS?.uuid ?? '',
        {
            nodeType: 'AS',
            relationshipType: 'ISVS_realizuje_AS',
        },
        { query: { enabled: !!selectedISVS } },
    )

    useEffect(() => {
        if (neighborsISVSRaw && neighborsISVSRaw.fromCiSet) {
            const fromCiSet = neighborsISVSRaw.fromCiSet

            if (fromCiSet.length > 0 && Array.isArray(fromCiSet[0].attributes)) {
                fromCiSet.forEach(transformAttributesKeyValue)
            }

            setNeighborsISVS(fromCiSet)
        }
    }, [neighborsISVSRaw])

    const { data, isError, isFetching } = useListParameterTypes(
        {
            serviceType: entityName,
            ...(filter.ignoreNonActual && { ignoreNonActual: filter.ignoreNonActual == 'true' }),
            ...(filter.paramType && { paramType: filter.paramType }),
            ...(filter.services && { services: filter.services }),
            ...(filter.valueType && { valueType: filter.valueType }),
            page: filter.pageNumber,
            perPageSize: filter.pageSize,
            sortBy: filter.sort?.[0]?.orderBy ?? defaultFilterValues.sort?.[0].orderBy,
            ascending: filter.sort?.[0]?.sortDirection === SortType.ASC,
        },
        { query: { enabled: !!filter.services && filter.services.length > 0 } },
    )
    return (
        <View
            neighborsISVS={neighborsISVS}
            selectedISVS={selectedISVS}
            setSelectedISVS={setSelectedISVS}
            valueUnitsOptions={valueUnitsEnum?.enumItems}
            valueTypesOptions={valueTypesOptions}
            handleFilterChange={handleFilterChange}
            filter={filter}
            data={data}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            entityName={entityName}
            dataParamTypes={dataParamTypes}
            defaultFilterValues={defaultFilterValues}
            isLoading={isLoadingParamTypes || isFetching || isValueTypesLoading || isParamUnitTypesLoading || isNeighborsISVSLoading}
            isError={isErrorParamTypes || isError}
        />
    )
}

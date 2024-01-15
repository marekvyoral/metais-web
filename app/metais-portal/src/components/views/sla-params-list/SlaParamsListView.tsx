import { Filter, LoadingIndicator, MultiSelect, PaginatorWrapper, SelectLazyLoading, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { MetaAttributesState, SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiSlaParameterRead } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { DEFAULT_PAGESIZE_OPTIONS, categoryParameterMap } from '@isdd/metais-common/constants'
import { ATTRIBUTE_NAME, ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback, SlaViewOptions } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'
import { useNavigate } from 'react-router-dom'

import { IView, SlaParamsListFilterData } from '@/components/containers/sla-params-list/SlaParamsListContainer'

export const SlaParamsListView: React.FC<IView> = ({
    entityName,
    isLoading,
    isError,
    dataParamTypes,
    defaultFilterValues,
    selectedItems,
    setSelectedItems,
    data,
    filter,
    handleFilterChange,
    valueTypesOptions,
    valueUnitsOptions,
    selectedISVS,
    setSelectedISVS,
    neighborsISVS,
}) => {
    const { t } = useTranslation()
    const loadServices = useReadCiList1Hook()
    const navigate = useNavigate()
    const columns: Array<ColumnDef<ApiSlaParameterRead>> = [
        {
            id: 'serviceName',
            header: t('sla-params-list.serviceName'),
            accessorFn: (row) => row.serviceInfo?.name,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => ctx.getValue() as string,
            },
        },
        {
            id: 'parameterType',
            header: t('sla-params-list.parameterType'),
            accessorFn: (row) => row.slaParamTypeCode,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => {
                return dataParamTypes?.results?.find((i) => i.code == row.cell.row.original.slaParamTypeCode)?.name
            },
        },
        {
            id: 'value',
            header: t('sla-params-list.value'),
            accessorFn: (row) => row.value,
            cell: (row) => {
                return (
                    row.getValue() +
                    ' ' +
                    valueUnitsOptions?.find(
                        (vu) => vu.code == dataParamTypes?.results?.find((i) => i.code == row.cell.row.original.slaParamTypeCode)?.unit,
                    )?.value
                )
            },
        },
        {
            id: 'valueType',
            header: t('sla-params-list.valueType'),
            accessorFn: (row) => row.valueType,
            cell: (row) => {
                return valueTypesOptions.find((i) => i.value == row.cell.row.original.valueType)?.label
            },
        },
    ]

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1

        const response = await loadServices({
            filter: {
                fullTextSearch: searchQuery,
                type: [entityName],
                uuid: [],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: page,
            perpage: 200,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        })

        const options = response.configurationItemSet
        return {
            options: options || [],
            hasMore: neighborsISVS ? false : options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const loadOptionsISVS = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1

        const response = await loadServices({
            filter: {
                fullTextSearch: searchQuery,
                type: ['ISVS'],
                uuid: [],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: page,
            perpage: 200,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        })
        const options = response.configurationItemSet

        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }
    return (
        <QueryFeedback loading={false} error={isError}>
            {isLoading && <LoadingIndicator />}
            <TextHeading size="XL">{t('sla-params-list.heading', { entityName })}</TextHeading>

            <Filter<SlaParamsListFilterData>
                onlyForm
                defaultFilterValues={defaultFilterValues}
                form={({ setValue }) => (
                    <div>
                        <SimpleSelect
                            id="paramsType"
                            name="paramsType"
                            label={t('sla-params-list.selectParamType')}
                            options={dataParamTypes?.results?.map((param) => ({ value: param.code ?? '', label: param.name ?? '' })) ?? []}
                            setValue={setValue}
                        />
                        <SimpleSelect
                            id="valueType"
                            name="valueType"
                            label={t('sla-params-list.selectValueType')}
                            options={valueTypesOptions}
                            setValue={setValue}
                            defaultValue={filter.valueType}
                        />
                        <SimpleSelect
                            id="ignoreNonActual"
                            name="ignoreNonActual"
                            label={t('sla-params-list.selectView')}
                            options={SlaViewOptions}
                            setValue={setValue}
                            defaultValue={filter.ignoreNonActual}
                        />
                        {entityName == 'AS' && (
                            <SelectLazyLoading
                                key="ISVS"
                                id="ISVS"
                                getOptionLabel={(item: ConfigurationItemUi) =>
                                    item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais] +
                                    ' - ' +
                                    item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                                }
                                getOptionValue={(item: ConfigurationItemUi) => item.uuid ?? ''}
                                loadOptions={(searchTerm, _, additional) => loadOptionsISVS(searchTerm, additional)}
                                label={t('sla-params-list.selectISVS')}
                                name="select-configuration-item-ISVS"
                                onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => {
                                    setSelectedISVS(val as ConfigurationItemUi)
                                }}
                                value={selectedISVS}
                            />
                        )}
                        {selectedISVS == undefined ? (
                            <SelectLazyLoading
                                required
                                key="services"
                                id="services"
                                isMulti
                                getOptionLabel={(item: ConfigurationItemUi) =>
                                    item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais] +
                                    ' - ' +
                                    item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
                                }
                                getOptionValue={(item: ConfigurationItemUi) => item.uuid ?? ''}
                                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                label={t('sla-params-list.selectService')}
                                name="select-configuration-item"
                                onChange={(val: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => {
                                    setValue(
                                        'services',
                                        (val as MultiValue<ConfigurationItemUi>).map((i) => i.uuid ?? ''),
                                    )
                                    setSelectedItems(val as MultiValue<ConfigurationItemUi>)
                                }}
                                value={selectedItems}
                            />
                        ) : (
                            neighborsISVS && (
                                <MultiSelect
                                    label={t('sla-params-list.selectService') + ' ' + t('input.requiredField')}
                                    name="services"
                                    options={[
                                        ...(selectedItems?.map((i) => ({
                                            label: `${i.attributes?.Gen_Profil_kod_metais} ${i.attributes?.Gen_Profil_nazov}`,
                                            value: i.uuid ?? '',
                                            disabled: false,
                                        })) ?? []),
                                        ...neighborsISVS.map((n) => ({
                                            value: n.uuid ?? '',
                                            label: `${n.attributes?.Gen_Profil_kod_metais} ${n.attributes?.Gen_Profil_nazov}`,
                                            disabled: false,
                                        })),
                                    ]}
                                    value={selectedItems?.map((i) => i.uuid ?? '')}
                                    onChange={(newValue: string[]) => {
                                        setValue('services', newValue)
                                        const value = [...selectedItems, ...neighborsISVS].filter((si) => newValue.includes(si.uuid ?? ''))
                                        setSelectedItems([...new Set(value)])
                                    }}
                                />
                            )
                        )}
                    </div>
                )}
            />

            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: data?.pagination?.totalItems || 0,
                }}
                entityName="paramsList"
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handleFilterChange={(pagination) => {
                    if ((pagination.pageNumber ?? BASE_PAGE_NUMBER) * (pagination.pageSize ?? BASE_PAGE_SIZE) > (data?.pagination?.totalItems ?? 0)) {
                        handleFilterChange({ pageSize: pagination.pageSize, pageNumber: 1 })
                    } else {
                        handleFilterChange(pagination)
                    }
                }}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table
                onRowClick={(row) =>
                    navigate(
                        `/sla-detail/${entityName}/${categoryParameterMap.get(entityName)}/${row.original.serviceInfo?.uuid}/${row.original.uuid}`,
                    )
                }
                data={data?.results}
                columns={columns}
                sort={filter.sort}
                onSortingChange={(columnSort) => handleFilterChange({ sort: columnSort })}
            />

            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={data?.pagination?.totalItems || 0}
                handlePageChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}

export default SlaParamsListView

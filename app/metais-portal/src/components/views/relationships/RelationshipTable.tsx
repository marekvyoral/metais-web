import { Filter } from '@isdd/idsk-ui-kit/filter'
import { MultiSelect } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { NeighboursFilterUi } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { INeighboursFilter } from '@isdd/metais-common/api/filter/filterApi'

import { TableCols } from '../documents'

interface RelationshipsTable {
    data?: TableCols[] //missing return types from orval, types should come from backend, not from _GeneratedType file
    defaultFilter?: INeighboursFilter
    filterData?: NeighboursFilterUi
    isLoading: boolean
    isError: boolean
    columns: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

type RelationFilterData = IFilterParams & NeighboursFilterUi

export const RelationshipsTable: React.FC<RelationshipsTable> = ({
    data,
    columns,
    isLoading,
    isError,
    pagination,
    defaultFilter,
    filterData,
    handleFilterChange,
}) => {
    const { t } = useTranslation()

    const ciTypeOption = filterData?.ciType?.map((type) => ({ label: type, value: type })) || []
    const relTypeOption = filterData?.relType?.map((type) => ({ label: type, value: type })) || []
    const stateOption = [
        { value: 'DRAFT', label: t('metaAttributes.state.DRAFT') },
        { value: 'INVALIDATED', label: t('metaAttributes.state.INVALIDATED') },
    ]

    const defaultValues: RelationFilterData = {
        relType: defaultFilter?.neighboursFilter?.relType,
        ciType: defaultFilter?.neighboursFilter?.ciType,
        metaAttributes: defaultFilter?.neighboursFilter?.metaAttributes,
        fullTextSearch: defaultFilter?.neighboursFilter?.fullTextSearch,
    }

    return (
        <>
            <Filter<RelationFilterData>
                defaultFilterValues={defaultValues}
                handleOnSubmit={({ ciType, metaAttributes, relType, fullTextSearch }) => {
                    handleFilterChange({
                        neighboursFilter: {
                            ciType,
                            metaAttributes,
                            relType,
                            fullTextSearch,
                        },
                    })
                }}
                form={({ setValue }) => (
                    <div>
                        <MultiSelect
                            name="ciType"
                            label={t('relationshipsTab.table.ciType')}
                            placeholder={t('relationshipsTab.select.ciType')}
                            options={ciTypeOption}
                            defaultValue={defaultFilter?.neighboursFilter?.ciType}
                            setValue={setValue}
                        />
                        <MultiSelect
                            name="relType"
                            label={t('relationshipsTab.table.relationshipType')}
                            placeholder={t('relationshipsTab.select.relationshipType')}
                            options={relTypeOption}
                            defaultValue={defaultFilter?.neighboursFilter?.relType}
                            setValue={setValue}
                        />
                        <MultiSelect
                            name="metaAttributes.state"
                            label={t('relationshipsTab.table.evidenceStatus')}
                            placeholder={t('relationshipsTab.select.evidenceStatus')}
                            options={stateOption}
                            defaultValue={defaultFilter?.neighboursFilter?.metaAttributes?.state}
                            setValue={setValue}
                        />
                    </div>
                )}
            />

            <Table columns={columns} data={data} isLoading={isLoading} error={isError} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}

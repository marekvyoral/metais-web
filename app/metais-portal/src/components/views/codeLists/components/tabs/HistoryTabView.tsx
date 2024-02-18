import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { Table, PaginatorWrapper, Filter, MultiSelect, GridRow, GridCol, Input } from '@isdd/idsk-ui-kit/index'
import { ColumnDef } from '@tanstack/react-table'
import { ApiCodelistHistory } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'

import {
    CodeListDetailHistoryFilterData,
    CodeListDetailHistoryViewProps,
    defaultFilterValues,
} from '@/components/containers/CodeListDetailHistoryContainer'

export const HistoryTabView: React.FC<CodeListDetailHistoryViewProps> = ({ data, isLoading, isError, filter, handleFilterChange }) => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<ApiCodelistHistory>> = [
        {
            id: 'action',
            header: t('codeListDetail.history.table.action'),
            size: 150,
            accessorFn: (row) => row.action,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            enableSorting: true,
        },
        {
            id: 'changedAt',
            header: t('codeListDetail.history.table.changedAt'),
            size: 150,
            accessorFn: (row) => row.changedAt,
            cell: (row) => t('dateTime', { date: row.getValue() }),
            enableSorting: true,
        },
        {
            id: 'changedBy',
            header: t('codeListDetail.history.table.changedBy'),
            accessorFn: (row) => row.changedBy,
            enableSorting: true,
        },
    ]

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            {isError && <QueryFeedback error={isError} loading={false} />}
            <Filter<CodeListDetailHistoryFilterData>
                heading={t('codeList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                handleOnSubmit={({ action, lastModifiedBy, fromDate, toDate }) => {
                    handleFilterChange({
                        action,
                        lastModifiedBy,
                        fromDate,
                        toDate,
                    })
                }}
                form={({ filter: formFilter, setValue, register }) => (
                    <div>
                        <MultiSelect
                            label={t('codeListDetail.history.filter.action')}
                            options={data?.filter.actions?.map((item) => ({ label: item, value: item })) ?? []}
                            name="action"
                            setValue={setValue}
                            defaultValue={formFilter.action || defaultFilterValues.action}
                        />
                        <MultiSelect
                            label={t('codeListDetail.history.filter.lastModifiedBy')}
                            options={data?.filter.modifiedBy?.map((item) => ({ label: item, value: item })) ?? []}
                            name="lastModifiedBy"
                            setValue={setValue}
                            defaultValue={formFilter.lastModifiedBy || defaultFilterValues.lastModifiedBy}
                        />
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <Input
                                    {...register('fromDate')}
                                    type="date"
                                    name="fromDate"
                                    label={t('codeListDetail.history.filter.lastChangeFrom')}
                                    id="fromDate"
                                />
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <Input
                                    {...register('toDate')}
                                    type="date"
                                    name="toDate"
                                    label={t('codeListDetail.history.filter.lastChangeTo')}
                                    id="toDate"
                                />
                            </GridCol>
                        </GridRow>
                    </div>
                )}
            />
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: data?.history?.codelistHistoriesCount ?? 0,
                }}
                entityName=""
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table
                data={data?.history?.codelistHistories}
                columns={columns}
                sort={filter.sort ?? []}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={data?.history?.codelistHistoriesCount || 0}
                handlePageChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}

import { ActionsOverTable, QueryFeedback, formatDateForDefaultValue } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Input, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ColumnDef } from '@tanstack/react-table'
import { ApiMonitoringOverviewList, ApiMonitoringOverviewService } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { Link } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { MonitoringFilterData } from '@/components/containers/MonitoringServiceListContainer'

interface IServicesView {
    isLoading: boolean
    isError: boolean
    filterParams: MonitoringFilterData
    data?: ApiMonitoringOverviewList
    defaultFilterValues: MonitoringFilterData
    handleFilterChange: (filter: IFilter) => void
}

export const ServicesView: React.FC<IServicesView> = ({ data, isError, isLoading, filterParams, defaultFilterValues, handleFilterChange }) => {
    const { t, i18n } = useTranslation()
    const columns: Array<ColumnDef<ApiMonitoringOverviewService>> = [
        {
            accessorFn: (row) => row?.name,
            header: t('monitoringServices.table.serviceName'),
            id: 'serviceName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link
                    to={`monitoras?serviceUuid=${ctx?.row?.original?.uuid}&dateFrom=${formatDateForDefaultValue(
                        ctx.row?.original?.interval?.start ?? '',
                    )}&dateTo=${formatDateForDefaultValue(ctx.row?.original?.interval?.end ?? '')}`}
                    state={{ from: location }}
                >
                    {ctx?.row?.original?.name}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.code,
            header: t('monitoringServices.table.code'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            id: 'code',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => data?.poResults?.find((po) => po.uuid === row?.poUuid)?.name,
            header: t('monitoringServices.table.serviceType'),
            id: 'serviceType',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.interval?.start,
            header: t('monitoringServices.table.from'),
            id: 'start',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => new Date(ctx.row?.original?.interval?.start ?? '').toLocaleDateString(i18n.language),
        },
        {
            accessorFn: (row) => row?.interval?.end,
            header: t('monitoringServices.table.to'),
            id: 'end',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => new Date(ctx.row?.original?.interval?.end ?? '').toLocaleDateString(i18n.language),
        },
    ]

    return (
        <MainContentWrapper>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('titles.monitoringServices')}</TextHeading>
                    {isError && <QueryFeedback loading={false} error={isError} />}
                </FlexColumnReverseWrapper>
                <Filter<MonitoringFilterData>
                    onlyForm
                    defaultFilterValues={defaultFilterValues}
                    form={({ setValue, clearErrors, filter, register }) => {
                        return (
                            <div>
                                <SimpleSelect
                                    name="serviceType"
                                    label={t('reports.filter.category')}
                                    options={[
                                        { label: 'AS', value: 'AS' },
                                        { label: 'KS', value: 'KS' },
                                    ]}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                    defaultValue={filter.serviceType}
                                />
                                <Input type="date" label={t('monitoringServices.table.from')} {...register('intervalStart')} />
                                <Input type="date" label={t('monitoringServices.table.to')} {...register('intervalEnd')} />
                            </div>
                        )
                    }}
                />
                <ActionsOverTable
                    pagination={{
                        pageNumber: filterParams.pageNumber ?? BASE_PAGE_NUMBER,
                        pageSize: filterParams.pageSize ?? BASE_PAGE_SIZE,
                        dataLength: data?.pagination?.totalItems ?? 0,
                    }}
                    handleFilterChange={handleFilterChange}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName={'reports'}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                />

                <Table columns={columns} data={data?.results} />
                <PaginatorWrapper
                    dataLength={data?.pagination?.totalItems ?? 0}
                    pageNumber={filterParams.pageNumber ?? BASE_PAGE_NUMBER}
                    pageSize={filterParams.pageSize ?? BASE_PAGE_SIZE}
                    handlePageChange={(page) => handleFilterChange({ pageNumber: page.pageNumber ?? BASE_PAGE_SIZE })}
                />
            </QueryFeedback>
        </MainContentWrapper>
    )
}

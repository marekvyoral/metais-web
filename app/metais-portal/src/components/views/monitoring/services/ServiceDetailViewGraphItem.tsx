import React, { useState, useEffect, useMemo } from 'react'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, IconLabel, QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { Button, GridCol, GridRow, PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import {
    ApiParameterType,
    MonitoredValue,
    MonitoredValuesList,
    useListParameterValuesHook,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ChangeIcon } from '@isdd/metais-common/assets/images'
import { ColumnDef } from '@tanstack/react-table'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilter } from '@isdd/idsk-ui-kit/types/filter'

import ServiceLinearGraph from './ServiceLinearGraph'
import styles from './service.module.scss'
import { paramTypeEnum } from './utils'

import { IQueryParamsDetail } from '@/pages/monitoring/services/monitoras/[serviceUuid]'

interface IServiceDetailViewGraphItem {
    item: ApiParameterType
    tableDataParam?: EnumType
    queryParams?: IQueryParamsDetail
}

export const ServiceDetailViewGraphItem: React.FC<IServiceDetailViewGraphItem> = ({ item, tableDataParam, queryParams }) => {
    const { t, i18n } = useTranslation()
    const [isLoadingBlock, setIsLoadingBlock] = useState<boolean>(false)
    const [isErrorBlock, setIsErrorBlock] = useState<boolean>(false)
    const [toggleTable, setToggleTable] = useState<boolean>(false)
    const [tableData, setTableData] = useState<MonitoredValuesList | undefined>(undefined)
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(BASE_PAGE_NUMBER)

    const getParameterValues = useListParameterValuesHook()

    useEffect(() => {
        setIsLoadingBlock(true)
        item.id &&
            getParameterValues({
                intervalStart: queryParams?.dateFrom,
                intervalEnd: queryParams?.dateTo,
                entityRef: queryParams?.serviceUuid ?? '',
                parameterTypeId: item.id,
                perPageSize: 100000,
                sortAttr: 'intervalStart',
                sortAsc: true,
            })
                .then((res) => {
                    setTableData(res)
                })
                .catch(() => {
                    setIsErrorBlock(true)
                })
                .finally(() => {
                    setIsLoadingBlock(false)
                })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns: Array<ColumnDef<MonitoredValue>> = [
        {
            accessorFn: (row) => row?.value,
            header: item.name,
            id: 'value',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.monitoredInterval?.start,
            header: t('monitoringServices.table.from'),
            id: 'start',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => new Date(ctx.row?.original?.monitoredInterval?.start ?? '').toLocaleDateString(i18n.language),
        },
        {
            accessorFn: (row) => row?.monitoredInterval?.end,
            header: t('monitoringServices.table.to'),
            id: 'end',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => new Date(ctx.row?.original?.monitoredInterval?.end ?? '').toLocaleDateString(i18n.language),
        },
    ]

    const isAverage = (dataUnit: string) => {
        switch (dataUnit) {
            case paramTypeEnum.PARAM_TYPE_UNIT_SECONDS:
            case paramTypeEnum.PARAM_TYPE_UNIT_MILLISECONDS:
            case paramTypeEnum.PARAM_TYPE_UNIT_PERCENTAGE:
                return true
            default:
                return false
        }
    }

    const calculateSumValueByUnit = (dataUnit: string, sum: number, count: number) => {
        if (isAverage(dataUnit)) {
            return count !== 0 ? (sum / count).toFixed(2) : 0
        }
        return sum
    }

    const setTotalCount = (results: MonitoredValue[], dataUnit: string) => {
        if (results.length > 0) {
            const sum = results?.reduce((partialSum, a) => partialSum + +(a.value ?? 0), 0)
            return calculateSumValueByUnit(dataUnit, sum, results.length)
        }

        return 0
    }

    const handlePageChange = (filterPage: IFilter) => {
        setPageNumber(filterPage?.pageNumber ?? 0)
        setStart((filterPage?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filterPage?.pageNumber ?? 0) * pageSize)
    }

    const handleSetPageSize = (filterPage: IFilter) => {
        setPageSize(filterPage?.pageSize ?? BASE_PAGE_SIZE)
        setPageNumber(1)
        setStart(1 * (filterPage?.pageSize ?? 0) - (filterPage?.pageSize ?? 0))
        setEnd(1 * (filterPage?.pageSize ?? 0))
    }

    const enumItem = useMemo(() => {
        return i18n.language === 'sk'
            ? item.unit && tableDataParam?.enumItems?.find((e) => e.code === item.unit)?.value
            : item.unit && tableDataParam?.enumItems?.find((e) => e.code === item.unit)?.engValue
    }, [i18n.language, item.unit, tableDataParam?.enumItems])

    return (
        <div key={item.id} className={styles.topSpace}>
            <QueryFeedback loading={isLoadingBlock} error={isErrorBlock} withChildren>
                {tableData?.results?.length ? (
                    <>
                        <GridRow>
                            <GridCol setWidth="one-half">
                                <div className={styles.labelDiv}>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setToggleTable(!toggleTable)}
                                        aria-label={
                                            toggleTable ? t('monitoringServices.detail.changeToGraph') : t('monitoringServices.detail.changeToTable')
                                        }
                                        label={<IconLabel icon={ChangeIcon} />}
                                    />
                                    <label className="govuk-label">
                                        <TextHeading size="M">{item.name} </TextHeading>
                                    </label>
                                    <Tooltip descriptionElement={item.description} altText={`Tooltip ${item.name}`} />
                                </div>
                            </GridCol>
                            <GridCol setWidth="one-half">
                                <div className={styles.actionRow}>
                                    <TextHeading size="S">
                                        {isAverage(item.unit ?? '')
                                            ? `${t('monitoringServices.detail.avarageInPeriod')}`
                                            : `${t('monitoringServices.detail.totalInPeriod')}`}
                                        {` ${setTotalCount(tableData?.results ?? [], item.unit ?? '')} ${enumItem}`}
                                    </TextHeading>
                                </div>
                            </GridCol>
                        </GridRow>
                        <GridRow>
                            <GridCol>
                                {toggleTable ? (
                                    <>
                                        <ActionsOverTable
                                            pagination={{ pageSize, pageNumber, dataLength: tableData?.results?.length || 0 }}
                                            handleFilterChange={handleSetPageSize}
                                            hiddenButtons={{ SELECT_COLUMNS: true }}
                                            entityName=""
                                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                        />
                                        <Table
                                            columns={columns}
                                            data={tableData?.results?.slice(start, end)}
                                            pagination={{ pageIndex: pageNumber, pageSize }}
                                        />
                                        <PaginatorWrapper
                                            pageNumber={pageNumber}
                                            pageSize={pageSize}
                                            dataLength={tableData?.results?.length ?? 0}
                                            handlePageChange={handlePageChange}
                                        />
                                    </>
                                ) : (
                                    <ServiceLinearGraph key={item.id + 'graph'} data={tableData?.results ?? []} />
                                )}
                            </GridCol>
                        </GridRow>
                    </>
                ) : (
                    <></>
                )}
            </QueryFeedback>
        </div>
    )
}

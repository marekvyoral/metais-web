//https://metais-test.vicepremier.gov.sk/dms/file/history/8b37a6e4-ddf5-4ea4-bd78-65aad73431ad
import { PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { MetaVersion, useGetHistory } from '@isdd/metais-common/api/generated/dms-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import { bytesToMB } from '@isdd/metais-common/utils/utils'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
    entityId: string
    itemName: string
}

type CustomMetaVersion = MetaVersion & {
    validityEnd?: string | null
    isLast?: boolean
}

export const DmsFileHistory: React.FC<Props> = ({ entityId, itemName }) => {
    const { t } = useTranslation()
    const { data: historyData, isError: isHistoryError, isLoading: isHistoryLoading } = useGetHistory(entityId)

    const [pageNumber, setPageNumber] = useState(BASE_PAGE_NUMBER)
    const [pageSize, setPageSize] = useState(BASE_PAGE_SIZE)
    const dataLength = historyData?.versions?.length ?? 0
    const startOfList = pageNumber * pageSize - pageSize
    const endOfList = pageNumber * pageSize

    const data: CustomMetaVersion[] =
        historyData?.versions?.map((version, index) => {
            const next = historyData?.versions?.[index + 1]
            return {
                ...version,
                isLast: !next,
                validityEnd: next ? next.lastModified : null,
            }
        }) ?? []

    const columns: Array<ColumnDef<CustomMetaVersion>> = [
        {
            header: t('dmsFileHistory.fileName'),
            accessorFn: (row) => row?.filename,
            enableSorting: true,
            id: 'fileName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
            size: 200,
        },
        {
            header: t('dmsFileHistory.version'),
            accessorFn: (row) => row?.version,
            enableSorting: true,
            id: 'version',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
            size: 100,
        },
        {
            header: t('dmsFileHistory.mimeType'),
            accessorFn: (row) => row?.mimeType,
            enableSorting: true,
            id: 'mimeType',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
            size: 300,
        },
        {
            header: t('dmsFileHistory.contentLength'),
            accessorFn: (row) => row?.contentLength,
            enableSorting: true,
            id: 'contentLength',
            meta: {
                getCellContext: (ctx) => `${bytesToMB(ctx?.getValue?.() as number)} Mb`,
            },
            cell: (ctx) => `${bytesToMB(ctx?.getValue?.() as number)} Mb`,
            size: 100,
        },
        {
            header: t('dmsFileHistory.validityFrom'),
            accessorFn: (row) => row?.lastModified,
            enableSorting: true,
            id: 'validityFrom',
            meta: {
                getCellContext: (ctx) => t('dateTime', { date: ctx?.getValue?.() }),
            },
            cell: (ctx) => t('dateTime', { date: ctx?.getValue?.() }),
            size: 150,
        },
        {
            header: t('dmsFileHistory.validityTo'),
            accessorFn: (row) => row?.validityEnd,
            enableSorting: true,
            id: 'validityTo',
            meta: {
                getCellContext: (ctx) => {
                    if (ctx.row.original.isLast) {
                        return t('dmsFileHistory.currentVersion')
                    } else {
                        return t('dateTime', { date: ctx?.getValue?.() })
                    }
                },
            },
            cell: (ctx) => {
                if (ctx.row.original.isLast) {
                    return t('dmsFileHistory.currentVersion')
                } else {
                    return t('dateTime', { date: ctx?.getValue?.() })
                }
            },
            size: 150,
        },
        {
            header: t('dmsFileHistory.lastModifiedBy'),
            accessorFn: (row) => row?.lastModifiedBy,
            enableSorting: true,
            id: 'lastModifiedBy',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
            size: 200,
        },
    ]

    return (
        <QueryFeedback loading={isHistoryLoading} error={isHistoryError}>
            <TextHeading size="M">{t('dmsFileHistory.heading', { item: itemName })}</TextHeading>
            <ActionsOverTable
                entityName=""
                pagination={{ pageNumber, pageSize, dataLength }}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handleFilterChange={(filter) => {
                    setPageSize(filter.pageSize ?? BASE_PAGE_SIZE)
                }}
            />
            <Table columns={columns} data={data?.slice(startOfList, endOfList)} />
            <PaginatorWrapper
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={dataLength}
                handlePageChange={(filter) => {
                    setPageNumber(filter.pageNumber ?? BASE_PAGE_NUMBER)
                    setPageSize(filter.pageSize ?? BASE_PAGE_SIZE)
                }}
            />
        </QueryFeedback>
    )
}

import { ExpandableRowCellWrapper, PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { KrisToBeIsvs, KrisToBeRights, useGetIsvs } from '@isdd/metais-common/api/generated/kris-swagger'
import { ActionsOverTable, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef, ExpandedState } from '@tanstack/react-table'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Link } from 'react-router-dom'
import { useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IsvsEvaluationRow } from '@/components/views/evaluation/components/IsvsEvaluationRow'

interface IIsvsEvaluationAccordionProps {
    entityId: string
    dataRights?: KrisToBeRights
    isGlobalAllowed: boolean
}

export const IsvsEvaluationAccordion: React.FC<IIsvsEvaluationAccordionProps> = ({ entityId, dataRights, isGlobalAllowed }) => {
    const { t } = useTranslation()
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(0)
    const [expandedState, setExpandedState] = useState<ExpandedState>({})
    const { data: dataEnumsState, isError: isErrorEnum, isLoading: isLoadingEnum } = useGetEnum('STAV_ISVS')
    const { data: dataEnumsType, isError: isErrorEnumTyp, isLoading: isLoadingEnuTyp } = useGetEnum('TYP_ISVS')
    const {
        data: krisToBeIsvsData,
        isLoading: isLoadingKrisToBeIsvsData,
        isError: isErrorKrisToBeIsvsData,
    } = useGetAttributeProfile('Profil_KRIS_TO_BE_ISVS')
    const {
        data,
        isError: isErrorData,
        isLoading: isLoadingData,
        refetch,
        isRefetching,
    } = useGetIsvs(entityId, {
        page: currentPage,
        count: pageSize,
        order: 'CODE',
        direction: 'DESC',
    })

    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
        refetch()
    }

    const handlePageSelect = (page: number) => {
        setCurrentPage(page)
        refetch()
    }

    const columns: Array<ColumnDef<KrisToBeIsvs>> = [
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.table.isvsCode'),
            id: 'isvsCode',
            cell: (ctx) => (
                <ExpandableRowCellWrapper row={ctx.row}>
                    <Link to={`/ci/ISVS/${ctx.row?.original?.uuid}`} target="_blank" className="govuk-link">
                        {ctx.row?.original?.code}
                    </Link>
                </ExpandableRowCellWrapper>
            ),
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.table.name'),
            id: 'name',
            cell: (ctx) => ctx.row?.original?.name,
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.table.state'),
            id: 'state',
            cell: (ctx) => dataEnumsState?.enumItems?.find((item) => item.code === ctx.row?.original?.isvsState)?.description,
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.table.type'),
            id: 'type',
            cell: (ctx) => dataEnumsType?.enumItems?.find((item) => item.code === ctx.row?.original?.isvsType)?.description,
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.table.modulIsvs'),
            id: 'modulIsvs',
            cell: (ctx) => (
                <Link to={`/ci/ISVS/${ctx.row?.original?.modulUuid}`} target="_blank" className="govuk-link">
                    {ctx.row?.original?.modulName}
                </Link>
            ),
        },
    ]

    const isLoading = [isRefetching, isLoadingEnum, isLoadingEnuTyp, isLoadingData, isLoadingKrisToBeIsvsData].some((item) => item)
    const isError = [isErrorEnum, isErrorEnum, isErrorEnumTyp, isErrorData, isErrorKrisToBeIsvsData].some((item) => item)

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <ActionsOverTable
                pagination={{ pageNumber: currentPage, pageSize, dataLength: data?.totalElements ?? 0 }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handlePagingSelect={handlePagingSelect}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName={''}
            />
            <Table
                columns={columns}
                data={data?.content ?? []}
                expandedRowsState={expandedState}
                onExpandedChange={setExpandedState}
                getExpandedRow={(row) => (
                    <IsvsEvaluationRow
                        entityId={entityId}
                        uuid={row?.original?.uuid}
                        isvsAttributes={krisToBeIsvsData}
                        dataRights={dataRights}
                        isGlobalAllowed={isGlobalAllowed}
                    />
                )}
            />
            <PaginatorWrapper
                pageSize={pageSize}
                pageNumber={currentPage}
                dataLength={data?.totalElements ?? 0}
                handlePageChange={(page) => handlePageSelect(page.pageNumber ?? -1)}
            />
        </QueryFeedback>
    )
}

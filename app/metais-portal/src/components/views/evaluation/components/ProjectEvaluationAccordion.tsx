import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { KrisToBeKs, KrisToBeRights, useGetKs } from '@isdd/metais-common/api/generated/kris-swagger'
import { ActionsOverTable, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef, ExpandedState } from '@tanstack/react-table'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { Link } from 'react-router-dom'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { KSEvaluationRow } from '@/components/views/evaluation/components/KSEvaluationRow'

interface IProjectEvaluationAccordionProps {
    entityId: string
    dataRights?: KrisToBeRights
    isGlobalAllowed: boolean
}

export const ProjectEvaluationAccordion: React.FC<IProjectEvaluationAccordionProps> = ({ entityId, dataRights, isGlobalAllowed }) => {
    const { t } = useTranslation()
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(0)
    const [expandedState, setExpandedState] = useState<ExpandedState>({})
    const {
        data: krisToBeIsvsData,
        isLoading: isLoadingKrisToBeIsvsData,
        isError: isErrorKrisToBeIsvsData,
    } = useGetAttributeProfile('Profil_KRIS_TO_BE_KS')

    const {
        data,
        isError: isErrorData,
        isLoading: isLoadingData,
        refetch,
        isRefetching,
    } = useGetKs(entityId, {
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

    const columns: Array<ColumnDef<KrisToBeKs>> = [
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.ksTable.ksCode'),
            id: 'isvsCode',
            cell: (ctx) => (
                <Link to={`/ci/ks/${ctx.row?.original?.uuid}`} target="_blank" className="govuk-link">
                    {ctx.row?.original?.code}
                </Link>
            ),
            size: 200,
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.ksTable.ksName'),
            id: 'name',
            cell: (ctx) => ctx.row?.original?.name,
            size: 200,
        },
        {
            accessorFn: (row) => row?.code,
            header: t('evaluation.ksTable.ksPhases'),
            id: 'state',
            cell: (ctx) => (
                <Link to={`/ci/FazaZivotnehoCyklu/${ctx.row?.original?.fazaUuid}`} target="_blank" className="govuk-link">
                    {ctx.row?.original?.fazaName}
                </Link>
            ),
            size: 200,
        },
    ]

    const isLoading = [isRefetching, isLoadingData, isLoadingKrisToBeIsvsData].some((item) => item)
    const isError = [isErrorData, isErrorKrisToBeIsvsData].some((item) => item)

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
                    <KSEvaluationRow
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

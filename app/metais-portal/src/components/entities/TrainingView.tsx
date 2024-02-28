import { Filter, PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { Trainee } from '@isdd/metais-common/api/generated/trainings-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TrainingExportButton } from '@isdd/metais-common/src/components/actions-over-table/actions-trainings/TrainingExportButton'

import { TrainingContainerView } from '@/components/containers/TrainingContainer'

export const TrainingView: React.FC<TrainingContainerView> = ({
    isLoading,
    isError,
    filteredData,
    filter,
    handleFilterChange,
    data,
    trainingName,
}) => {
    const { t } = useTranslation()

    const { isActionSuccess } = useActionSuccess()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback(true)
    }, [isActionSuccess.value, scrollToMutationFeedback])

    const columns: Array<ColumnDef<Trainee>> = [
        {
            header: t('trainings.table.lastName'),
            accessorFn: (row) => {
                return row.lastName
            },
            id: 'lastName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            size: 150,
            cell: (ctx) => ctx?.getValue?.() as string,
        },
        {
            header: t('trainings.table.firstName'),
            accessorFn: (row) => {
                return row.firstName
            },
            id: 'firstName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            size: 150,
            cell: (ctx) => ctx?.getValue?.() as string,
        },
        {
            header: t('trainings.table.registrationDate'),
            accessorFn: (row) => {
                return row.createdAt
            },
            id: 'createdAt',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            size: 150,
            cell: (ctx) => t('dateTime', { date: ctx?.getValue?.() as string }),
        },
    ]

    const pageNumber = filter.pageNumber ?? BASE_PAGE_NUMBER
    const pageSize = filter.pageSize ?? BASE_PAGE_SIZE
    const startOfList = pageNumber * pageSize - pageSize
    const endOfList = pageNumber * pageSize
    const slicedTableData = filteredData.slice(startOfList, endOfList) || []

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <TextHeading size="L">{t('trainings.invitedTitle')}</TextHeading>
            {isActionSuccess && isActionSuccess.additionalInfo?.type === 'relationCreated' && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={isActionSuccess.value}
                        successMessage={t('mutationFeedback.successfulRelationCreated')}
                        error={false}
                    />
                </div>
            )}
            <Filter form={() => <></>} defaultFilterValues={filter} onlySearch />
            <ActionsOverTable
                pagination={{
                    pageNumber,
                    pageSize,
                    dataLength: filteredData?.length ?? 0,
                }}
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
                exportButton={!!data?.[0]?.trainingId && <TrainingExportButton trainingUuid={data[0].trainingId} trainingName={trainingName} />}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
            />
            <Table columns={columns} data={slicedTableData} isLoading={isLoading} error={isError} />
            <PaginatorWrapper
                pageSize={pageSize}
                pageNumber={pageNumber}
                dataLength={filteredData.length ?? 0}
                handlePageChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}

import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import {
    ActionsOverTable,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    ModalButtons,
    QueryFeedback,
    formatDateTimeForDefaultValue,
} from '@isdd/metais-common/index'
import { ApiStandardRequestPreview, useGetAllStandardRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import { Filter } from '@isdd/idsk-ui-kit/filter/Filter'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { CheckBox, TextLinkExternal } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import styles from './meetingProposalsModal.module.scss'

interface IMeetingProposalsModalProps {
    isOpen: boolean
    className?: string
    close: () => void
    setSelectedProposals: React.Dispatch<string[]>
    selectedProposals: string[]
}

export interface FilterMeetingData extends IFilterParams {
    srName: string
}
const defaultPagination: Pagination = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

export const MeetingProposalsModal: React.FC<IMeetingProposalsModalProps> = ({ isOpen, close, setSelectedProposals, selectedProposals }) => {
    const { t } = useTranslation()
    // const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    // const [currentPage, setCurrentPage] = useState(1)
    // const startOfList = currentPage * pageSize - pageSize
    // const endOfList = currentPage * pageSize

    // const handlePagingSelect = (value: string) => {
    //     setPageSize(Number(value))
    // }

    const [pagination, setPagination] = useState(defaultPagination)

    // const filteredData = useMemo(() => {
    //     const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
    //     const endOfList = pagination.pageNumber * pagination.pageSize
    //     return data?.slice(startOfList, endOfList) || []
    // }, [data, pagination.pageNumber, pagination.pageSize])

    const myHandleFilterChange = (myFilter: IFilter) => {
        setPagination({
            ...pagination,
            pageSize: myFilter.pageSize ?? BASE_PAGE_SIZE,
            pageNumber: myFilter.pageNumber ?? defaultPagination.pageNumber,
        })
    }
    const defaultFilterValues = {
        sort: [],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        fullTextSearch: '',
        srName: '',
    }
    const { filter, handleFilterChange } = useFilterParams<FilterMeetingData>(defaultFilterValues)
    const { data, isLoading, isError } = useGetAllStandardRequests()
    const [rowSelection, setRowSelection] = useState<Array<string>>(selectedProposals)

    const filteredData = useMemo(() => {
        return (
            data?.standardRequests?.filter((request) => latiniseString(request.srName ?? '').includes(latiniseString(filter.fullTextSearch ?? ''))) ||
            []
        )
    }, [data?.standardRequests, filter.fullTextSearch])

    const tableData = useMemo(() => {
        const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
        const endOfList = pagination.pageNumber * pagination.pageSize
        return filteredData?.slice(startOfList, endOfList) || []
    }, [filteredData, pagination.pageNumber, pagination.pageSize])

    const handleCheckboxChange = useCallback(
        (row: Row<ApiStandardRequestPreview>) => {
            if (row.original.id) {
                if (rowSelection.includes(row.original.id.toString())) {
                    setRowSelection((prev) => prev.filter((id) => id !== row.original.id?.toString()))
                } else {
                    setRowSelection((prev) => [...prev, row.original.id?.toString() || ''])
                }
            }
        },
        [rowSelection, setRowSelection],
    )
    const handleAllCheckboxChange = () => {
        if (!data) return
        const checkedAll = filteredData?.every((row) => rowSelection.includes(row.id?.toString() || ''))

        if (checkedAll) {
            setRowSelection([])
            return
        }
        const customRows = filteredData?.map((row) => row.id?.toString() || '') || []
        setRowSelection(customRows)
    }
    const handleClose = () => {
        handleFilterChange(defaultFilterValues)
        close()
    }
    useEffect(() => {
        setRowSelection(selectedProposals)
    }, [selectedProposals])

    const columns: Array<ColumnDef<ApiStandardRequestPreview>> = [
        {
            header: () => {
                const checkedAll = filteredData?.every((row) => rowSelection.includes(row.id?.toString() || ''))

                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => handleAllCheckboxChange()}
                            checked={checkedAll}
                            title={t('table.selectAllItems')}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => {
                return (
                    <>
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id={`checkbox_${row.id}`}
                                value="true"
                                onChange={() => {
                                    handleCheckboxChange(row)
                                }}
                                checked={row.original.id ? !!rowSelection.includes(row.original.id.toString()) : false}
                                title={t('table.selectItem', { itemName: row.original.srName })}
                            />
                        </div>
                    </>
                )
            },
        },
        {
            header: t('meetings.proposals.srName'),
            accessorFn: (row) => row?.srName,
            enableSorting: true,
            id: 'srName',
            meta: {
                getCellContext: (ctx: CellContext<ApiStandardRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <TextLinkExternal
                    href={NavigationSubRoutes.ZOZNAM_NAVRHOV + '/' + ctx.row.original.id}
                    newTab
                    title={ctx.getValue() as string}
                    textLink={ctx.getValue() as string}
                >
                    {ctx.getValue() as string}
                </TextLinkExternal>
            ),
        },
        {
            header: t('meetings.proposals.createdAt'),
            accessorFn: (row) => formatDateTimeForDefaultValue(row?.createdAt ?? '', 'dd.MM.yyyy, HH:mm'),
            enableSorting: true,
            id: 'createdAt',
            meta: {
                getCellContext: (ctx: CellContext<ApiStandardRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.proposals.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx: CellContext<ApiStandardRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.proposals.requestChannel'),
            accessorFn: (row) => row?.requestChannel,
            enableSorting: true,
            id: 'requestChannel',
            meta: {
                getCellContext: (ctx: CellContext<ApiStandardRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                ctx.row?.original?.requestChannel ? (
                    <span>{t(`meetings.proposals.requestChannelValue.${ctx.row?.original?.requestChannel}`)}</span>
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('meetings.proposals.standardRequestState'),
            accessorFn: (row) => row?.standardRequestState,
            enableSorting: true,
            id: 'standardRequestState',
            meta: {
                getCellContext: (ctx: CellContext<ApiStandardRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                ctx.row?.original?.standardRequestState ? (
                    <span>{t(`meetings.proposals.standardRequestStateValue.${ctx.row?.original?.standardRequestState}`)}</span>
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
    ]
    return (
        <BaseModal isOpen={isOpen} close={handleClose}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t('meetings.form.heading.proposals')}
                    </TextHeading>
                    <Filter defaultFilterValues={filter} onlySearch form={() => <></>} />
                    <ActionsOverTable
                        pagination={{ ...pagination, dataLength: filteredData?.length ?? 0 }}
                        entityName={''}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        handleFilterChange={myHandleFilterChange}
                    />
                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                        <Table data={tableData} columns={columns} isLoading={isLoading} error={isError} />

                        <PaginatorWrapper
                            dataLength={filteredData.length ?? 0}
                            pageNumber={pagination.pageNumber}
                            pageSize={pagination.pageSize}
                            handlePageChange={(page) => setPagination({ ...pagination, pageNumber: page.pageNumber ?? defaultPagination.pageNumber })}
                        />
                    </QueryFeedback>
                </div>
            </div>
            <ModalButtons
                submitButtonLabel={t('button.saveChanges')}
                onSubmit={() => {
                    setSelectedProposals(rowSelection)
                    handleClose()
                }}
                closeButtonLabel={t('button.cancel')}
                onClose={handleClose}
            />
        </BaseModal>
    )
}

import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { CellContext, ColumnDef, Row } from '@tanstack/react-table'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import { ApiStandardRequestPreview, useGetAllStandardRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import { Filter } from '@isdd/idsk-ui-kit/filter/Filter'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { Button, CheckBox } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'

import styles from './meetingProposalsModal.module.scss'

interface IMeetingProposalsModalProps {
    isOpen: boolean
    className?: string
    close: () => void
    isLoading?: boolean
    error?: boolean
    setSelectedProposals: React.Dispatch<string[]>
    selectedProposals: string[]
}

export interface FilterMeetingData extends IFilterParams {
    srName: string
}

export const MeetingProposalsModal: React.FC<IMeetingProposalsModalProps> = ({
    isOpen,
    close,
    isLoading,
    error,
    setSelectedProposals,
    selectedProposals,
}) => {
    const { t } = useTranslation()
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const startOfList = currentPage * pageSize - pageSize
    const endOfList = currentPage * pageSize

    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
    }
    const defaultFilterValues = {
        sort: [],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        fullTextSearch: '',
        srName: '',
    }
    const { filter, handleFilterChange } = useFilterParams<FilterMeetingData>(defaultFilterValues)
    const { data } = useGetAllStandardRequests()
    const [rowSelection, setRowSelection] = useState<Array<string>>(selectedProposals)
    const filteredData = useMemo(() => {
        return data?.standardRequests?.filter((request) => latiniseString(request.srName ?? '').includes(latiniseString(filter.fullTextSearch ?? '')))
    }, [data?.standardRequests, filter.fullTextSearch])
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
                                //containerClassName={styles.marginBottom15}
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
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
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
                    <ActionsOverTable handlePagingSelect={handlePagingSelect} entityName={''} hiddenButtons={{ SELECT_COLUMNS: true }} />
                    <Table data={filteredData?.slice(startOfList, endOfList)} columns={columns} isLoading={isLoading} error={error} />

                    <PaginatorWrapper
                        pageSize={pageSize}
                        pageNumber={currentPage}
                        dataLength={filteredData?.length ?? 0}
                        handlePageChange={(page) => setCurrentPage(page.pageNumber ?? -1)}
                    />
                    <div className={styles.submitButton}>
                        <Button
                            label={t('button.saveChanges')}
                            onClick={() => {
                                setSelectedProposals(rowSelection)
                                handleClose()
                            }}
                        />

                        <Button
                            variant="secondary"
                            label={t('button.cancel')}
                            onClick={() => {
                                handleClose()
                            }}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

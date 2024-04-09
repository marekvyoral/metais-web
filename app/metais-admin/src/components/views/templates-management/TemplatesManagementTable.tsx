import { Button, ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { MessageUi, UpdateTemplateRequest } from '@isdd/metais-common/api/generated/notification-manager-swagger'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import sanitizeHtml from 'sanitize-html'

interface ITemplatesTable {
    data?: MessageUi[]
    editTemplate: (editedTemplate: UpdateTemplateRequest, id: number) => Promise<void>
}

export const TemplatesManagementTable: React.FC<ITemplatesTable> = ({ data, editTemplate }) => {
    const { t } = useTranslation()
    const { currentPreferences } = useUserPreferences()

    const [selectedRow, setSelectedRow] = useState<number>()
    const [templates, setTemplates] = useState(data)
    const tableRef = useRef<HTMLTableElement>(null)

    const sortedData = useMemo(() => data?.sort((a, b) => (a.id || 0) - (b.id || 0)) || [], [data])
    const [pageSize, setPageSize] = useState<number>(Number(currentPreferences.defaultPerPage) || BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(BASE_PAGE_NUMBER)

    const handlePageChange = (filter: IFilter) => {
        setCurrentPage(filter?.pageNumber ?? 0)
    }

    const handlePerPageChange = (filter: IFilter | undefined) => {
        if (currentPage * pageSize > sortedData.length) {
            setCurrentPage(1)
        }
        const newPageSize = Number(filter?.pageSize)
        setPageSize(newPageSize)
    }

    const setTemplateMessage = (id: number | undefined, message: string) => {
        setTemplates((prev) => {
            const templateIndex = prev?.findIndex((o) => o.id === id) ?? -1
            if (templateIndex == -1) {
                return prev
            }
            prev?.splice(templateIndex, 1, { id, message })
            return prev
        })
    }
    const handleSaveTemplates = (id: number) => {
        const templateFind = templates?.find((o) => o.id === id)
        if (templateFind) {
            editTemplate({ message: templateFind?.message }, id)
        }
        setSelectedRow(undefined)
    }

    useEffect(() => {
        setTemplates(data)
    }, [data])

    const columns: Array<ColumnDef<MessageUi>> = [
        {
            accessorFn: (row) => row?.key,
            header: t('templatesManagement.table.key'),
            id: 'templatesManagement.table.key',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.message,
            header: t('templatesManagement.table.value'),
            id: 'templatesManagement.table.value',
            size: 800,
            cell: (ctx) =>
                ctx?.row?.original.id === selectedRow ? (
                    <RichTextQuill
                        name={t('templatesManagement.table.value')}
                        id={`${t('templatesManagement.table.value')}_${ctx.row.original.id}`}
                        value={templates?.find((template) => template.id === ctx.row.original.id)?.message}
                        onChange={(value) => setTemplateMessage(ctx.row.original.id, value)}
                    />
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(ctx?.getValue?.() as string) }} />
                ),
        },
        {
            accessorFn: (row) => row,
            header: t('templatesManagement.table.actions'),
            id: 'templatesManagement.table.actions',
            cell: (ctx) => {
                if (ctx?.row?.original.id === selectedRow) {
                    return (
                        <ButtonGroupRow type="column">
                            <Button
                                type="button"
                                onClick={() => {
                                    ctx.row.original.id && handleSaveTemplates(ctx.row.original.id)
                                }}
                                label={t('templatesManagement.table.save')}
                                bottomMargin={false}
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    ctx.row.original.id && setSelectedRow(undefined)
                                }}
                                variant="secondary"
                                label={t('templatesManagement.table.cancel')}
                                bottomMargin={false}
                            />
                        </ButtonGroupRow>
                    )
                } else
                    return (
                        <Button
                            type="button"
                            onClick={() => {
                                ctx.row.original.id && setSelectedRow(ctx.row.original.id)
                            }}
                            label={t('templatesManagement.table.edit')}
                        />
                    )
            },
        },
    ]

    return (
        <>
            <ActionsOverTable
                handleFilterChange={handlePerPageChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={'templates'}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                pagination={{ pageSize, pageNumber: currentPage, dataLength: sortedData?.length ?? 0 }}
            />
            <Table
                tableRef={tableRef}
                columns={columns.map((item) => ({ ...item, size: 150 }))}
                data={sortedData}
                manualPagination={false}
                pagination={{ pageIndex: currentPage - 1, pageSize: pageSize }}
            />
            <PaginatorWrapper
                dataLength={sortedData?.length ?? 0}
                pageNumber={currentPage}
                pageSize={pageSize}
                handlePageChange={(filter) => {
                    handlePageChange(filter)
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
            />
        </>
    )
}

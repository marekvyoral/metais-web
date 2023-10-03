import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { ButtonLink, Filter } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, NeighbourPairUi } from '@isdd/metais-common/api'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import {
    ActionsOverTable,
    BulkPopup,
    DeleteFileBulkModal,
    FileHistoryModal,
    InvalidateBulkModal,
    MutationFeedback,
    QueryFeedback,
    ReInvalidateBulkModal,
    UpdateFileModal,
} from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { downloadFile, isDocumentUpdatable, isDocumentsUpdatable } from './utils'

import { defaultFilter } from '@/components/containers/DocumentListContainer'

export interface TableCols extends NeighbourPairUi {
    selected?: boolean
}
interface DocumentsTable {
    refetch: () => void
    data?: TableCols[]
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    namesData?: { login: string; fullName: string }[]
}

export const DocumentsTable: React.FC<DocumentsTable> = ({
    data,
    additionalColumns,
    isLoading,
    isError,
    pagination,
    handleFilterChange,
    refetch,
    namesData,
}) => {
    const { t } = useTranslation()
    const { state: authState } = useAuth()
    const isUserAdmin = authState.user?.roles.includes('R_ADMIN')
    const isUserLogged = authState.user !== null
    const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`
    const [rowSelection, setRowSelection] = useState({})
    const additionalColumnsNullsafe = additionalColumns ?? []

    const { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleDeleteFile, handleUpdateFile } = useBulkAction()

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showDeleteFile, setShowDeleteFile] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    const [invalidateSingle, setInvalidateSingle] = useState<ConfigurationItemUi>()
    const [deleteSingle, setDeleteSingle] = useState<ConfigurationItemUi>()
    const [updateFile, setUpdateFile] = useState<ConfigurationItemUi>()
    const [singleItemHistory, setSingleItemHistory] = useState<ConfigurationItemUi>()

    const [checkedItemList, setCheckedItemList] = useState<TableCols[]>([])

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: () => void) => {
        closeFunction()
        refetch()
        setBulkActionResult(actionResult)
    }

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: ({ table }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        checked={table.getIsAllRowsSelected()}
                        label=""
                        name="checkbox"
                        id="checkbox-all"
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                </div>
            ),
            size: 45,
            id: CHECKBOX_CELL,
            cell: ({ row }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        onChange={row.getToggleSelectedHandler()}
                        checked={row.getIsSelected()}
                    />
                </div>
            ),
        },
        {
            accessorFn: (row) => row?.configurationItem,
            header: t('documentsTab.table.name'),
            id: 'documentsTab.table.name',
            size: 300,
            meta: {
                getCellContext: (ctx) => (ctx?.getValue?.() as ConfigurationItemUi).attributes?.Gen_Profil_nazo,
            },
            cell: (row) => {
                const ci = row.getValue() as ConfigurationItemUi
                return <a href={`${DMS_DOWNLOAD_FILE}${ci?.uuid}`}>{ci?.attributes?.Gen_Profil_nazov}</a>
            },
        },
        {
            accessorFn: (row) => row?.configurationItem?.attributes?.Gen_Profil_poznamka,
            header: t('documentsTab.table.note'),
            id: 'documentsTab.table.note',
            size: 200,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: 'documentsTab.table.evidenceStatus',
            size: 100,
            meta: {
                getCellContext: (ctx) => t(`metaAttributes.state.${ctx.getValue()}`),
            },
            cell: (row) => t(`metaAttributes.state.${row.getValue()}`) as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: 'documentsTab.table.createdAt',
            size: 100,
            cell: (row) => formatDateTimeForDefaultValue(row.getValue() as string),
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdBy,
            header: t('documentsTab.table.createdBy'),
            id: 'documentsTab.table.createdBy',
            size: 100,
            cell: (row) => namesData?.find((item) => item.login == (row.getValue() as string))?.fullName,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: 'documentsTab.table.lastModifiedAt',
            size: 100,
            cell: (row) => formatDateTimeForDefaultValue(row.getValue() as string),
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedBy,
            header: t('documentsTab.table.lastModifiedBy'),
            id: 'documentsTab.table.lastModifiedBy',
            size: 100,
            cell: (row) => namesData?.find((item) => item.login == (row.getValue() as string))?.fullName,
        },
        {
            accessorKey: 'bulkActions',
            header: '',
            id: 'bulkActions',
            size: 130,
            cell: (row) => (
                <BulkPopup
                    label={t('actionOverTable.options.title')}
                    items={() => [
                        <ButtonLink
                            key={'buttonDownload'}
                            label={t('actionOverTable.options.download')}
                            onClick={() => {
                                const item = data ? data[row.row.index] : {}
                                downloadFile(
                                    `${DMS_DOWNLOAD_FILE}${item.configurationItem?.uuid}`,
                                    item.configurationItem?.attributes?.Gen_Profil_nazov,
                                )
                            }}
                        />,
                        <ButtonLink
                            key={'buttonUpdate'}
                            label={t('actionOverTable.options.update')}
                            disabled={!isUserLogged}
                            onClick={() => {
                                if (data !== undefined) {
                                    const item = data[row.row.index]
                                    if (item.configurationItem !== undefined) {
                                        setUpdateFile(item.configurationItem)
                                    }
                                    if (updateFile !== undefined) handleUpdateFile([updateFile], () => setUpdateFile(undefined), open)
                                }
                            }}
                        />,
                        <ButtonLink
                            key={'buttonInvalidate'}
                            label={t('actionOverTable.options.invalidate')}
                            disabled={!isUserLogged}
                            onClick={() => {
                                if (data !== undefined) {
                                    const item = data[row.row.index]
                                    if (item.configurationItem !== undefined) {
                                        setInvalidateSingle(item.configurationItem)
                                    }
                                    if (invalidateSingle !== undefined)
                                        handleInvalidate([invalidateSingle], () => setInvalidateSingle(undefined), open, isDocumentUpdatable(item))
                                }
                            }}
                        />,

                        <ButtonLink
                            key={'buttonDelete'}
                            label={t('actionOverTable.options.delete')}
                            disabled={!isUserAdmin}
                            onClick={() => {
                                if (data !== undefined) {
                                    const item = data[row.row.index]
                                    if (item.configurationItem !== undefined) {
                                        setDeleteSingle(item.configurationItem)
                                    }
                                    if (deleteSingle !== undefined)
                                        handleDeleteFile([deleteSingle], () => setDeleteSingle(undefined), open, isDocumentUpdatable(item))
                                }
                            }}
                        />,

                        <ButtonLink
                            key={'buttonHistory'}
                            label={t('actionOverTable.options.history')}
                            onClick={() => {
                                if (data !== undefined) {
                                    const item = data[row.row.index]
                                    if (item.configurationItem !== undefined) {
                                        setSingleItemHistory(item.configurationItem)
                                    }
                                }
                            }}
                        />,
                    ]}
                />
            ),
        },
        ...additionalColumnsNullsafe,
    ]
    useEffect(() => {
        if (data !== undefined) {
            setCheckedItemList(Object.keys(rowSelection).map((item) => data[Number(item)] ?? {}))
        }
    }, [rowSelection, data])
    const filteredColumns = isUserLogged
        ? columns
        : columns.filter((column) => column.id != 'documentsTab.table.lastModifiedBy').filter((column) => column.id != 'documentsTab.table.createdBy')
    return (
        <QueryFeedback loading={isLoading || isBulkLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError ? t('feedback.mutationErrorMessage') : ''}
                />
            )}
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                entityName="documents"
                hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: Object.keys(rowSelection).length === 0 }}
                bulkPopup={
                    <Tooltip
                        descriptionElement={errorMessage}
                        position={'center center'}
                        tooltipContent={(open) => (
                            <div>
                                <BulkPopup
                                    items={() => [
                                        <ButtonLink
                                            key={'buttonValidateItems'}
                                            label={t('actionOverTable.validateItems')}
                                            disabled={!isUserLogged}
                                            onClick={() => {
                                                handleReInvalidate(
                                                    checkedItemList.map((item) => item.configurationItem ?? {}),
                                                    setShowReInvalidate,
                                                    open,
                                                )
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonInvalidateItems'}
                                            label={t('actionOverTable.invalidateItems')}
                                            disabled={!isUserLogged}
                                            onClick={() => {
                                                handleInvalidate(
                                                    checkedItemList.map((item) => item.configurationItem ?? {}),
                                                    setShowInvalidate,
                                                    open,
                                                    isDocumentsUpdatable(checkedItemList),
                                                )
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonDeleteItems'}
                                            label={t('actionOverTable.deleteItems')}
                                            disabled={!isUserAdmin}
                                            onClick={() => {
                                                handleDeleteFile(
                                                    checkedItemList.map((item) => item.configurationItem ?? {}),
                                                    () => setShowDeleteFile(true),
                                                    open,
                                                    isDocumentsUpdatable(checkedItemList),
                                                )
                                            }}
                                        />,
                                    ]}
                                />
                            </div>
                        )}
                    />
                }
            />
            <InvalidateBulkModal
                items={checkedItemList.map((item) => item.configurationItem ?? {})}
                open={showInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setShowInvalidate(false))}
                onClose={() => setShowInvalidate(false)}
            />

            <ReInvalidateBulkModal
                items={checkedItemList.map((item) => item.configurationItem ?? {})}
                open={showReInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setShowInvalidate(false))}
                onClose={() => setShowReInvalidate(false)}
            />

            <DeleteFileBulkModal
                items={checkedItemList.map((item) => item.configurationItem ?? {})}
                open={showDeleteFile}
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setShowDeleteFile(false))}
                onClose={() => setShowDeleteFile(false)}
            />

            {/* Single items */}
            {invalidateSingle && (
                <InvalidateBulkModal
                    items={[invalidateSingle]}
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setInvalidateSingle(undefined))}
                    onClose={() => setInvalidateSingle(undefined)}
                />
            )}
            {deleteSingle && (
                <DeleteFileBulkModal
                    items={[deleteSingle]}
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setDeleteSingle(undefined))}
                    onClose={() => setDeleteSingle(undefined)}
                />
            )}
            {updateFile && (
                <UpdateFileModal
                    item={updateFile}
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setUpdateFile(undefined))}
                    onClose={() => setUpdateFile(undefined)}
                />
            )}

            {singleItemHistory && <FileHistoryModal item={singleItemHistory} onClose={() => setSingleItemHistory(undefined)} />}
            <Filter form={() => <></>} defaultFilterValues={defaultFilter} onlySearch />
            <Table<TableCols> rowSelection={rowSelection} onRowSelectionChange={setRowSelection} columns={filteredColumns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}

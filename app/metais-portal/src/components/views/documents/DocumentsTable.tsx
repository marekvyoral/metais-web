import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Button, ButtonLink, Filter } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi, getReadCiNeighboursQueryKey } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import {
    ActionsOverTable,
    BulkPopup,
    DeleteFileBulkModal,
    FileHistoryModal,
    InvalidateBulkModal,
    MutationFeedback,
    ProjectUploadFileModal,
    QueryFeedback,
    ReInvalidateBulkModal,
    UpdateFileModal,
} from '@isdd/metais-common/index'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '@isdd/metais-common/src/components/actions-over-table/single-actions-popup/file-history/styles.module.scss'
import { INVALIDATED } from '@isdd/metais-common/constants'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useQueryClient } from '@tanstack/react-query'

import { downloadFile, isDocumentUpdatable, isDocumentsUpdatable, listToMap } from '@/components/views/documents/utils'
import { TableCols, defaultFilter } from '@/components/containers/DocumentListContainer'

interface DocumentsTable {
    ciData?: ConfigurationItemUi
    refetch: () => void
    data?: TableCols[]
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    namesData?: { login: string; fullName: string }[]
    selectedItems: { [key: number]: TableCols[] }
    setSelectedItems: React.Dispatch<
        React.SetStateAction<{
            [key: number]: TableCols[]
        }>
    >
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
    selectedItems,
    setSelectedItems,
    ciData,
}) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserAdmin = user?.roles.includes('R_ADMIN')
    const isUserLogged = user !== null
    const isInvalidated = ciData?.metaAttributes?.state === INVALIDATED
    const [rowSelection, setRowSelection] = useState({})

    const additionalColumnsNullsafe = additionalColumns ?? []

    const { errorMessage, isBulkLoading, handleInvalidate, handleReInvalidate, handleDeleteFile, handleUpdateFile } = useBulkAction()

    const [showInvalidate, setShowInvalidate] = useState<boolean>(false)
    const [showReInvalidate, setShowReInvalidate] = useState<boolean>(false)
    const [showDeleteFile, setShowDeleteFile] = useState<boolean>(false)
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()
    const [openAddModal, setOpenAddModal] = useState<ConfigurationItemUi>()

    const [invalidateSingle, setInvalidateSingle] = useState<ConfigurationItemUi>()
    const [deleteSingle, setDeleteSingle] = useState<ConfigurationItemUi>()
    const [updateFile, setUpdateFile] = useState<ConfigurationItemUi>()
    const [singleItemHistory, setSingleItemHistory] = useState<ConfigurationItemUi>()
    const queryClient = useQueryClient()
    const queryKey = getReadCiNeighboursQueryKey(ciData?.uuid ?? '', {})

    const [successfullyAdded, setSuccessfullyAdded] = useState<string[]>([])

    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: () => void) => {
        closeFunction()
        queryClient.invalidateQueries([queryKey[0]])
        refetch()
        setBulkActionResult(actionResult)
    }

    const columns: Array<ColumnDef<TableCols>> = [
        ...(isUserLogged
            ? [
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
                                  title={t('table.selectAllItems')}
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
                                  title={t('table.selectItem', {
                                      itemName: row.original.configurationItem?.attributes?.Gen_Profil_nazov,
                                  })}
                              />
                          </div>
                      ),
                  } as ColumnDef<TableCols>,
              ]
            : []),
        {
            accessorFn: (row) => row?.configurationItem,
            header: t('documentsTab.table.name'),
            id: 'documentsTab.table.name',
            size: 200,
            meta: {
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) =>
                    (ctx?.getValue?.() as ConfigurationItemUi).attributes?.Gen_Profil_nazo,
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
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: 'documentsTab.table.evidenceStatus',
            size: 100,
            meta: {
                getCellContext: (ctx: CellContext<ConfigurationItemUi, unknown>) => t(`metaAttributes.state.${ctx.getValue()}`),
            },
            cell: (row) => t(`metaAttributes.state.${row.getValue()}`) as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: 'documentsTab.table.createdAt',
            size: 100,
            cell: (ctx) => t('dateTime', { date: ctx.getValue() as string }),
        },
        ...(isUserLogged
            ? [
                  {
                      accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdBy,
                      header: t('documentsTab.table.createdBy'),
                      id: 'documentsTab.table.createdBy',
                      size: 100,
                      cell: (row) => namesData?.find((item) => item.login == (row.getValue() as string))?.fullName,
                  } as ColumnDef<TableCols>,
              ]
            : []),
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: 'documentsTab.table.lastModifiedAt',
            size: 100,
            cell: (ctx) => t('dateTime', { date: ctx.getValue() as string }),
        },
        ...(isUserLogged
            ? [
                  {
                      accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedBy,
                      header: t('documentsTab.table.lastModifiedBy'),
                      id: 'documentsTab.table.lastModifiedBy',
                      size: 100,
                      cell: (row) => namesData?.find((item) => item.login == (row.getValue() as string))?.fullName,
                  } as ColumnDef<TableCols>,
              ]
            : []),
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
                            hidden={!isUserLogged}
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
                            hidden={!isUserLogged}
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
                            hidden={!isUserLogged}
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
            setSelectedItems({ ...selectedItems, ...{ [pagination.pageNumber]: Object.keys(rowSelection).map((item) => data[Number(item)] ?? {}) } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection, pagination.pageNumber])
    useEffect(() => {
        if (data !== undefined && selectedItems[pagination.pageNumber] != undefined) {
            const rowSel = listToMap(data, selectedItems[pagination.pageNumber])
            setRowSelection(rowSel)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (bulkActionResult?.isError || bulkActionResult?.isSuccess) {
            scrollToMutationFeedback()
        }
    }, [bulkActionResult, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading || isBulkLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={bulkActionResult?.isSuccess && bulkActionResult?.additionalInfo?.action !== 'addedDocuments'}
                    successMessage={bulkActionResult?.successMessage + successfullyAdded.join(',')}
                    error={bulkActionResult?.isError && bulkActionResult?.additionalInfo?.action !== 'addedDocuments'}
                    onMessageClose={() => setBulkActionResult(undefined)}
                />
            </div>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={bulkActionResult?.isSuccess && bulkActionResult?.additionalInfo?.action === 'addedDocuments'}
                    successMessage={t(`addFile${successfullyAdded.length > 1 ? 's' : ''}Success`, {
                        docs: successfullyAdded.join(', '),
                    })}
                    onMessageClose={() => setBulkActionResult(undefined)}
                />
            </div>

            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                entityName="documents"
                hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: Object.keys(rowSelection).length === 0 }}
                createButton={
                    <Button
                        disabled={isInvalidated}
                        label={t('documentsTab.addNewDocument')}
                        onClick={() => setOpenAddModal({})}
                        className={styles.marginBottom0}
                    />
                }
                selectedRowsCount={Object.keys(rowSelection).length}
                bulkPopup={({ selectedRowsCount }) => (
                    <Tooltip
                        descriptionElement={errorMessage}
                        position={'center center'}
                        tooltipContent={(open) => (
                            <BulkPopup
                                checkedRowItems={selectedRowsCount}
                                items={(closePopup) => [
                                    <ButtonLink
                                        key={'buttonValidateItems'}
                                        label={t('actionOverTable.validateItems')}
                                        disabled={!isUserLogged}
                                        onClick={() => {
                                            handleReInvalidate(
                                                Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {})),
                                                () => setShowReInvalidate(true),
                                                open,
                                            )
                                            closePopup()
                                        }}
                                    />,
                                    <ButtonLink
                                        key={'buttonInvalidateItems'}
                                        label={t('actionOverTable.invalidateItems')}
                                        disabled={!isUserLogged}
                                        onClick={() => {
                                            handleInvalidate(
                                                Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {})),
                                                () => setShowInvalidate(true),
                                                open,
                                                isDocumentsUpdatable(Object.values(selectedItems).flatMap((i) => i)),
                                            )
                                            closePopup()
                                        }}
                                    />,
                                    <ButtonLink
                                        key={'buttonDeleteItems'}
                                        label={t('actionOverTable.deleteItems')}
                                        disabled={!isUserAdmin}
                                        onClick={() => {
                                            handleDeleteFile(
                                                Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {})),
                                                () => setShowDeleteFile(true),
                                                open,
                                                isDocumentsUpdatable(Object.values(selectedItems).flatMap((i) => i)),
                                            )
                                            closePopup()
                                        }}
                                    />,
                                ]}
                            />
                        )}
                    />
                )}
            />
            <InvalidateBulkModal
                items={Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {}))}
                open={showInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setShowInvalidate(false))}
                onClose={() => setShowInvalidate(false)}
            />
            <ReInvalidateBulkModal
                items={Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {}))}
                open={showReInvalidate}
                multiple
                onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setShowInvalidate(false))}
                onClose={() => setShowReInvalidate(false)}
            />

            <DeleteFileBulkModal
                items={Object.values(selectedItems).flatMap((item) => item.map((i) => i.configurationItem ?? {}))}
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
            {openAddModal && (
                <ProjectUploadFileModal
                    isCi
                    project={ciData}
                    docNumber={String(data?.length) ?? '0'}
                    item={openAddModal}
                    open
                    onClose={() => setOpenAddModal(undefined)}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setOpenAddModal(undefined))}
                    setSuccessfullyAdded={setSuccessfullyAdded}
                />
            )}
            {singleItemHistory && <FileHistoryModal item={singleItemHistory} onClose={() => setSingleItemHistory(undefined)} />}
            <Filter form={() => <></>} defaultFilterValues={defaultFilter} onlySearch />
            <Table<TableCols> rowSelection={rowSelection} onRowSelectionChange={setRowSelection} columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}

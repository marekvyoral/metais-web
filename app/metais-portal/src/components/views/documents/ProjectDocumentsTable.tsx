import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Button, ButtonLink, PaginatorWrapper } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { BASE_PAGE_SIZE, ConfigurationItemUi, useGetMetaHook } from '@isdd/metais-common/api'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BASE_PAGE_NUMBER, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import {
    ActionsOverTable,
    BulkPopup,
    FileHistoryModal,
    InvalidateBulkModal,
    MutationFeedback,
    ProjectUploadFileModal,
    QueryFeedback,
    UpdateFileModal,
    formatDateTimeForDefaultValue,
} from '@isdd/metais-common/index'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { allChecked, checkAll, downloadFile, downloadFiles, filterAsync, isInvalid, isMeta } from './utils'

import { IDocType, IView } from '@/components/containers/ProjectDocumentListContainer'

export const ProjectDocumentsTable: React.FC<IView> = ({
    isLoading,
    isError,
    docs,
    addButtonSectionName,
    refetch,
    projectData,
    selectPageSize = false,
    setPageSize,
    pageSize,
    page,
    setPage,
    totalLength,
}) => {
    const { t } = useTranslation()
    const { state: authState } = useAuth()
    const isUserAdmin = authState.user?.roles.includes('R_ADMIN')
    const isUserLogged = authState.user !== null
    const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`
    const [rowSelection, setRowSelection] = useState({})
    const { errorMessage, isBulkLoading } = useBulkAction()
    const [invalidateItems, setInvalidateItems] = useState<ConfigurationItemUi[]>()
    const [deleteItems, setDeleteItems] = useState<ConfigurationItemUi[]>()
    const [updateFile, setUpdateFile] = useState<ConfigurationItemUi>()
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()
    const [openAddModal, setOpenAddModal] = useState<IDocType>()
    const [selectedItems, setSelectedItems] = useState<IDocType[]>([])
    const [singleItemHistory, setSingleItemHistory] = useState<IDocType>()
    const handleCloseBulkModal = (actionResult: IBulkActionResult, closeFunction: () => void) => {
        closeFunction()
        refetch()
        setBulkActionResult(actionResult)
    }
    const getMeta = useGetMetaHook()

    const getDefaultBulkActions = (row: CellContext<IDocType, unknown>) => [
        <ButtonLink
            key={'buttonDownload'}
            label={t('actionOverTable.options.download')}
            onClick={async () => {
                const item = docs ? docs[row.row.index] : {}
                const ressponse = await getMeta(item.uuid ?? '')
                if (ressponse) {
                    downloadFile(`${DMS_DOWNLOAD_FILE}${item?.uuid}`, item.name ?? item?.attributes?.Gen_Profil_nazov)
                }
            }}
        />,
        <ButtonLink
            key={'buttonUpdate'}
            label={t('actionOverTable.options.update')}
            disabled={!isUserLogged}
            onClick={() => {
                if (docs) {
                    const item = docs[row.row.index]
                    item && setUpdateFile(item)
                }
            }}
        />,
        <ButtonLink
            key={'buttonInvalidate'}
            label={t('actionOverTable.options.invalidate')}
            disabled={!isUserLogged}
            onClick={() => {
                if (docs) {
                    const item = docs[row.row.index]
                    item && setInvalidateItems([item])
                }
            }}
        />,

        <ButtonLink
            key={'buttonDelete'}
            label={t('actionOverTable.options.delete')}
            disabled={!isUserAdmin}
            onClick={() => {
                if (docs) {
                    const item = docs[row.row.index]
                    item && setDeleteItems([item])
                }
            }}
        />,

        <ButtonLink
            key={'buttonHistory'}
            label={t('actionOverTable.options.history')}
            onClick={() => {
                if (docs) {
                    const item = docs[row.row.index]
                    item && setSingleItemHistory(item)
                }
            }}
        />,
    ]

    const getAddAction = (row: CellContext<IDocType, unknown>) => [
        <ButtonLink
            key={'buttonDownload'}
            label={t('actionOverTable.options.addDocument')}
            onClick={() => {
                if (docs) {
                    const item = docs[row.row.index]
                    item && setOpenAddModal(item)
                }
            }}
        />,
    ]

    const getConfluenceActions = (row: CellContext<IDocType, unknown>) => [
        <ButtonLink
            key={'buttonOpen'}
            label={t('actionOverTable.options.openDocument')}
            onClick={async () => {
                const item = docs ? docs[row.row.index] : {}
                const ressponse = await getMeta(item.uuid ?? '')
                if (ressponse) {
                    downloadFile(`${DMS_DOWNLOAD_FILE}${item?.uuid}`, item.name ?? item?.attributes?.Gen_Profil_nazov)
                }
            }}
        />,
        <ButtonLink
            key={'buttonUpload'}
            label={t('actionOverTable.options.uploadDocument')}
            onClick={async () => {
                const item = docs ? docs[row.row.index] : {}
                const ressponse = await getMeta(item.uuid ?? '')
                if (ressponse) {
                    downloadFile(`${DMS_DOWNLOAD_FILE}${item?.uuid}`, item.name ?? item?.attributes?.Gen_Profil_nazov)
                }
            }}
        />,
    ]

    const resolveAction = (row: CellContext<IDocType, unknown>): JSX.Element[] => {
        if (row.cell.row.original.uuid == undefined && !!row.cell.row.original.confluence) {
            return getAddAction(row)
        } else if (row.cell.row.original.confluence) {
            return getConfluenceActions(row)
        }
        return getDefaultBulkActions(row)
    }

    const columns: Array<ColumnDef<IDocType>> = [
        {
            accessorKey: 'selected',
            header: ({ table }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        checked={allChecked(table)}
                        label=""
                        name="checkbox"
                        id="checkbox-all"
                        onChange={(newValue) => checkAll(table, newValue)}
                    />
                </div>
            ),
            size: 20,
            id: CHECKBOX_CELL,
            cell: ({ row }) =>
                row.original.uuid && (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            disabled={!row.original.uuid}
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
            accessorFn: (row) => (row?.attributes?.Gen_Profil_nazov == undefined ? row.name : row?.attributes?.Gen_Profil_nazov),
            header: t('documentsTab.table.name'),
            id: 'documentsTab.table.name',
            size: 400,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.() as string,
            },
            cell: (row) => {
                return row.cell.row.original?.uuid ? (
                    <ButtonLink
                        className={classNames(styles.buttonLinkWithIcon, { [styles.invalidated]: isInvalid(row.cell.row) })}
                        key="downloadFile"
                        label={row.getValue() as string}
                        onClick={async () => {
                            const item = docs ? docs[row.row.index] : {}
                            const response = await getMeta(item.uuid ?? '')
                            if (response) {
                                downloadFile(`${DMS_DOWNLOAD_FILE}${item?.uuid}`, item.name ?? item?.attributes?.Gen_Profil_nazov)
                            }
                        }}
                    />
                ) : (
                    (row.getValue() as string)
                )
            },
        },
        {
            accessorFn: (row) => row?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: 'state',
            size: 100,
            meta: {
                getCellContext: (ctx) => ctx.getValue() && t(`metaAttributes.state.${ctx.getValue()}`),
            },
            cell: (row) => row.getValue() && (t(`metaAttributes.state.${row.getValue()}`) as string),
        },
        {
            accessorFn: (row) => row?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: 'documentsTab.table.createdAt',
            size: 100,
            cell: (row) => row.getValue() && formatDateTimeForDefaultValue(row.getValue() as string),
        },

        {
            accessorFn: (row) => row?.metaAttributes?.createdBy,
            header: t('documentsTab.table.createdBy'),
            id: 'documentsTab.table.createdBy',
            size: 100,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: 'documentsTab.table.lastModifiedAt',
            size: 100,
            cell: (row) => row.getValue() && formatDateTimeForDefaultValue(row.getValue() as string),
        },

        {
            accessorFn: (row) => row?.metaAttributes?.lastModifiedBy,
            header: t('documentsTab.table.lastModifiedBy'),
            id: 'documentsTab.table.lastModifiedBy',
            size: 100,
        },

        {
            accessorKey: 'bulkActions',
            header: '',
            id: 'bulkActions',
            size: 80,
            cell: (row) => <BulkPopup label={t('actionOverTable.options.title')} items={() => resolveAction(row)} />,
        },
    ]

    useEffect(() => {
        if (docs) {
            setSelectedItems(Object.keys(rowSelection).map((item) => docs[Number(item)] ?? {}))
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection])

    const filteredColumns = isUserLogged
        ? columns
        : columns
              .filter((column) => column.id != 'documentsTab.table.lastModifiedBy')
              .filter((column) => column.id != 'documentsTab.table.createdBy')
              .filter((column) => column.id != 'bulkActions')
    return (
        <QueryFeedback loading={isLoading || isBulkLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <MutationFeedback
                    success={bulkActionResult?.isSuccess}
                    successMessage={bulkActionResult?.successMessage}
                    error={bulkActionResult?.isError ? bulkActionResult.errorMessage ?? t('feedback.mutationErrorMessage') : ''}
                />
            )}
            <ActionsOverTable
                handleFilterChange={(filter) => {
                    if (setPageSize) setPageSize(filter.pageSize ?? BASE_PAGE_SIZE)
                    if ((page ?? 0) * (filter.pageSize ?? BASE_PAGE_SIZE) > (totalLength ?? 0)) {
                        setPage && setPage(BASE_PAGE_NUMBER)
                    }
                }}
                pageSize={pageSize}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName="documents"
                hiddenButtons={{ SELECT_COLUMNS: true, PAGING: !selectPageSize }}
                createButton={
                    !!addButtonSectionName && (
                        <Button label={t('documentsTab.addNewDocument')} onClick={() => setOpenAddModal({})} className={styles.bottomMargin0} />
                    )
                }
                bulkPopup={
                    <Tooltip
                        descriptionElement={errorMessage}
                        position={'center center'}
                        tooltipContent={() => (
                            <div>
                                <BulkPopup
                                    items={() => [
                                        <ButtonLink
                                            key={'downloadItems'}
                                            label={t('actionOverTable.options.download')}
                                            disabled={!isUserLogged}
                                            onClick={async () => {
                                                const filtered = await filterAsync(selectedItems, async (item) => {
                                                    const meta = await isMeta(item.uuid ?? '', authState.accessToken)
                                                    return meta
                                                })

                                                if (filtered.length != selectedItems.length) {
                                                    setBulkActionResult({ isError: true, isSuccess: false, successMessage: '' })
                                                } else {
                                                    setBulkActionResult(undefined)
                                                }
                                                downloadFiles(
                                                    filtered.map((item) => ({
                                                        link: `${DMS_DOWNLOAD_FILE}${item?.uuid}`,
                                                        fileName: item.name ?? String(item?.attributes?.Gen_Profil_nazov),
                                                    })),
                                                )
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonInvalidateItems'}
                                            label={t('actionOverTable.invalidateItems')}
                                            disabled={!isUserLogged}
                                            onClick={() => {
                                                setInvalidateItems(selectedItems)
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonDeleteItems'}
                                            label={t('actionOverTable.deleteItems')}
                                            disabled={!isUserAdmin}
                                            onClick={() => {
                                                setDeleteItems(selectedItems)
                                            }}
                                        />,
                                    ]}
                                />
                            </div>
                        )}
                    />
                }
            />

            <Table rowSelection={rowSelection} onRowSelectionChange={setRowSelection} columns={filteredColumns} data={docs} />
            {selectPageSize && (
                <PaginatorWrapper
                    pageNumber={page ?? 0}
                    pageSize={pageSize ?? BASE_PAGE_SIZE}
                    handlePageChange={(filter) => {
                        setPage && setPage(filter.pageNumber ?? BASE_PAGE_NUMBER)
                    }}
                    dataLength={totalLength ?? 0}
                />
            )}
            {singleItemHistory && <FileHistoryModal item={singleItemHistory} onClose={() => setSingleItemHistory(undefined)} />}
            {updateFile && (
                <UpdateFileModal
                    addButtonSectionName={!!addButtonSectionName && addButtonSectionName != ' ' ? addButtonSectionName : undefined}
                    item={updateFile}
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setUpdateFile(undefined))}
                    onClose={() => setUpdateFile(undefined)}
                />
            )}
            {invalidateItems && (
                <InvalidateBulkModal
                    items={invalidateItems}
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setInvalidateItems(undefined))}
                    onClose={() => setInvalidateItems(undefined)}
                />
            )}
            {deleteItems && (
                <InvalidateBulkModal
                    items={deleteItems}
                    deleteFile
                    open
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setDeleteItems(undefined))}
                    onClose={() => setDeleteItems(undefined)}
                />
            )}
            {openAddModal && (
                <ProjectUploadFileModal
                    project={projectData}
                    docNumber={String(docs?.length) ?? '0'}
                    addButtonSectionName={addButtonSectionName}
                    item={openAddModal}
                    open
                    onClose={() => setOpenAddModal(undefined)}
                    onSubmit={(actionResponse) => handleCloseBulkModal(actionResponse, () => setOpenAddModal(undefined))}
                />
            )}
        </QueryFeedback>
    )
}

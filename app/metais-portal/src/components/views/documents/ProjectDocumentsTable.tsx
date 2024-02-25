import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { Button, ButtonLink, PaginatorWrapper } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetMetaHook } from '@isdd/metais-common/api/generated/dms-swagger'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { BASE_PAGE_NUMBER, DEFAULT_PAGESIZE_OPTIONS, INVALIDATED, ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IBulkActionResult, useBulkAction } from '@isdd/metais-common/hooks/useBulkAction'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useGetProjectDocumentHook, useUploadProjectDocumentHook } from '@isdd/metais-common/api/generated/wiki-swagger'
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
import { ApiError } from '@isdd/metais-common/api/generated/iam-swagger'

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
    const {
        state: { user, token },
    } = useAuth()
    const isUserAdmin = user?.roles.includes('R_ADMIN')
    const isUserLogged = user !== null
    const isInvalidated = projectData?.metaAttributes?.state === INVALIDATED
    const xWikiDoc = useGetProjectDocumentHook()
    const uploadxWikiDoc = useUploadProjectDocumentHook()

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
    const [isLocalLoading, setIsLocalLoading] = useState(false)

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
                const response = await getMeta(item.uuid ?? '')
                if (response) {
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

    const createAndOpenXWikiDoc = (row: CellContext<IDocType, unknown>) => {
        setIsLocalLoading(true)
        if (projectData?.uuid && row.cell.row.original.id) {
            xWikiDoc(projectData?.uuid, row.cell.row.original.id, { createIfNotExists: true })
                .then((doc) => doc.xwikiUrl && window.open(doc.xwikiUrl, '_blank'))
                .catch(() => setBulkActionResult({ isSuccess: false, isError: true }))
                .finally(() => setIsLocalLoading(false))
        }
    }

    const uploadXWikiDoc = (row: CellContext<IDocType, unknown>) => {
        setIsLocalLoading(true)

        if (projectData?.uuid && row.cell.row.original.id)
            uploadxWikiDoc(
                projectData?.uuid,
                row.cell.row.original.id,
                ...(row.cell.row.original.uuid ? [{ documentUuid: row.cell.row.original.uuid }] : []),
            )
                .then((resp) => {
                    if (resp) {
                        refetch()
                        setBulkActionResult({ isSuccess: true, isError: false, successMessage: t('bulkActions.addFile.success') })
                    }
                })
                .catch((err) => {
                    if (JSON.parse((err as ApiError).message ?? '').type == ReponseErrorCodeEnum.GNR404) {
                        setBulkActionResult({
                            isSuccess: false,
                            isError: true,
                            errorMessage: t('feedback.documentForProjectDoesntExists', {
                                docName: row.cell.row.original.name,
                                projectCode: projectData.attributes?.Gen_Profil_nazov,
                            }),
                        })
                    }
                })
                .finally(() => setIsLocalLoading(false))
    }

    const getConfluenceActions = (row: CellContext<IDocType, unknown>) => [
        <ButtonLink key={'buttonOpen'} label={t('actionOverTable.options.openDocument')} onClick={() => createAndOpenXWikiDoc(row)} />,
        <ButtonLink key={'buttonUpload'} label={t('actionOverTable.options.uploadDocument')} onClick={async () => uploadXWikiDoc(row)} />,
    ]

    const resolveAction = (row: CellContext<IDocType, unknown>): JSX.Element[] => {
        if (row.cell.row.original.uuid == undefined && !row.cell.row.original.confluence) {
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
                        title={t('table.selectAllItems')}
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
                            title={t('table.selectItem', { itemName: row.original.name ?? row.original?.attributes?.Gen_Profil_nazov })}
                        />
                    </div>
                ),
        },
        {
            accessorFn: (row) => (row?.name != undefined ? row.name : row?.attributes?.Gen_Profil_nazov),
            header: t('documentsTab.table.name'),
            id: 'documentsTab.table.name',
            size: 300,
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
            size: 100,
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

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (bulkActionResult?.isError || bulkActionResult?.isSuccess) {
            scrollToMutationFeedback()
        }
    }, [bulkActionResult, scrollToMutationFeedback])
    return (
        <QueryFeedback loading={isLoading || isBulkLoading || isLocalLoading} error={isError} indicatorProps={{ layer: 'parent' }} withChildren>
            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={bulkActionResult?.isSuccess}
                        successMessage={bulkActionResult?.successMessage}
                        showSupportEmail
                        error={bulkActionResult?.isError ? bulkActionResult.errorMessage ?? t('feedback.mutationErrorMessage') : ''}
                        onMessageClose={() => setBulkActionResult(undefined)}
                    />
                </div>
            )}
            <ActionsOverTable
                pagination={{
                    pageNumber: page ?? BASE_PAGE_NUMBER,
                    pageSize: pageSize ?? BASE_PAGE_SIZE,
                    dataLength: totalLength ?? 0,
                }}
                handleFilterChange={(filter) => {
                    if (setPageSize) setPageSize(filter.pageSize ?? BASE_PAGE_SIZE)
                    if ((page ?? 0) * (filter.pageSize ?? BASE_PAGE_SIZE) > (totalLength ?? 0)) {
                        setPage && setPage(BASE_PAGE_NUMBER)
                    }
                }}
                selectedRowsCount={Object.keys(rowSelection).length}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName="documents"
                hiddenButtons={{ SELECT_COLUMNS: true, PAGING: !selectPageSize }}
                createButton={
                    !!addButtonSectionName && (
                        <Button
                            disabled={isInvalidated}
                            label={t('documentsTab.addNewDocument')}
                            onClick={() => setOpenAddModal({})}
                            className={styles.bottomMargin0}
                        />
                    )
                }
                bulkPopup={
                    <Tooltip
                        descriptionElement={errorMessage}
                        position={'center center'}
                        tooltipContent={() => (
                            <div>
                                <BulkPopup
                                    items={(closePopup) => [
                                        <ButtonLink
                                            key={'downloadItems'}
                                            label={t('actionOverTable.options.download')}
                                            disabled={!isUserLogged}
                                            onClick={async () => {
                                                const filtered = await filterAsync(selectedItems, async (item) => {
                                                    const meta = await isMeta(item.uuid ?? '', token)
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
                                                closePopup()
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonInvalidateItems'}
                                            label={t('actionOverTable.invalidateItems')}
                                            disabled={!isUserLogged}
                                            onClick={() => {
                                                setInvalidateItems(selectedItems)
                                                closePopup()
                                            }}
                                        />,
                                        <ButtonLink
                                            key={'buttonDeleteItems'}
                                            label={t('actionOverTable.deleteItems')}
                                            disabled={!isUserAdmin}
                                            onClick={() => {
                                                setDeleteItems(selectedItems)
                                                closePopup()
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

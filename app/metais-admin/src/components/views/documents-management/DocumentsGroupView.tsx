import { BaseModal, Button, ButtonGroupRow, ButtonLink, ISelectColumnType, Tab, Table, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { RefAttributesRefType, useDeleteContent } from '@isdd/metais-common/api/generated/dms-swagger'
import { Document, getGetDocumentsQueryKey, useSaveDocument } from '@isdd/metais-common/api/generated/kris-swagger'
import { FileUpload, IFileUploadRef } from '@isdd/metais-common/components/FileUpload/FileUpload'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    GET_DOCUMENT_GROUPS_QUERY_KEY,
    documentsManagementGroupDocumentsDefaultSelectedColumns,
} from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ActionsOverTable, BulkPopup, ModalButtons, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const DocumentsGroupView: React.FC<IView> = ({
    infoData,
    documentsData,
    deleteDocumentGroup,
    deleteDocument,
    refetchDocuments,
    filter,
    handleFilterChange,
    refetchInfoData,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()

    const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false)
    const [documentToDelete, setDocumentToDelete] = useState<Document>()
    const [documentToAddTemplate, setDocumentToAddTemplate] = useState<Document>()
    const [documentDeleteTemplate, setDocumentDeleteTemplate] = useState<Document>()
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>(documentsManagementGroupDocumentsDefaultSelectedColumns(t))

    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const fileUploadRef = useRef<IFileUploadRef>(null)

    const {
        mutateAsync: updateDocument,
        isLoading: isDocumentUpdating,
        isError: isDocumentUpdatingError,
        isSuccess: isDocumentSuccessfullyUpdated,
    } = useSaveDocument({ mutation: { onSuccess: () => queryClient.invalidateQueries(getGetDocumentsQueryKey(infoData.id ?? 0)) } })
    const {
        mutateAsync: deleteTemplate,
        isLoading: isTemplateDeleting,
        isError: isTemplateDeletingError,
        isSuccess: isTemplateSuccessfullyDeleted,
        reset: resetDeletedResult,
    } = useDeleteContent()

    useEffect(() => {
        refetchInfoData()
    }, [refetchInfoData])

    const columns: Array<ColumnDef<Document>> = [
        {
            header: 'Id',
            accessorFn: (row) => row?.id,
            enableSorting: true,
            id: 'id',
        },
        {
            header: t('documentsManagement.name'),
            accessorFn: (row) => row?.name,
            size: 200,
            enableSorting: true,
            id: 'name',
        },
        {
            header: t('documentsManagement.description'),
            accessorFn: (row) => row?.description,
            size: 200,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            header: t('documentsManagement.nameEng'),
            accessorFn: (row) => row?.nameEng,
            size: 200,
            enableSorting: true,
            id: 'nameEng',
        },
        {
            header: t('documentsManagement.descriptionEng'),
            accessorFn: (row) => row.descriptionEng,
            size: 200,
            enableSorting: true,
            id: 'descriptionEng',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            header: t('documentsManagement.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            id: 'type',
        },

        {
            header: t('documentsManagement.documentGroup'),
            accessorFn: (row) => row?.documentGroup?.name,
            enableSorting: true,
            id: 'documentGroup',
        },
        {
            header: t('documentsManagement.xWiki'),
            accessorFn: (row) => row?.confluence,
            enableSorting: true,
            id: 'confluence',
            cell: (ctx) => (ctx?.getValue() ? t('radioButton.yes') : t('radioButton.no')),
        },
        {
            header: t('documentsManagement.required'),
            accessorFn: (row) => row?.required,
            enableSorting: true,
            id: 'required',
            cell: (ctx) => (ctx?.getValue() ? t('radioButton.yes') : t('radioButton.no')),
        },
        {
            header: t('actionsInTable.actions'),
            accessorKey: 'actions',
            id: 'actions',
            cell: (ctx) => (
                <BulkPopup
                    label={t('actionsInTable.moreActions')}
                    popupPosition="right"
                    items={(closePopup) => [
                        <ButtonLink
                            key={'updateButton'}
                            label={t('codelists.edit')}
                            onClick={() => {
                                navigate('./' + ctx?.row?.original?.id + '/edit', { state: { from: location } })
                                closePopup()
                            }}
                        />,
                        <ButtonLink
                            key={'deleteButton'}
                            label={t('codelists.remove')}
                            onClick={() => {
                                if (ctx.row.original.id != undefined) {
                                    setDocumentToDelete(documentsData.find((d) => d.id == ctx.row.original.id))
                                }
                                closePopup()
                            }}
                        />,
                        <ButtonLink
                            disabled={!!ctx.row.original.templateUuid}
                            key={'uploadTemplateButton'}
                            label={t('documentsManagement.uploadTemplate')}
                            onClick={() => {
                                resetDeletedResult()
                                if (ctx.row.original.id != undefined) {
                                    setDocumentToAddTemplate(documentsData.find((d) => d.id == ctx.row.original.id))
                                }
                                closePopup()
                            }}
                        />,
                        <ButtonLink
                            disabled={!ctx.row.original.templateUuid}
                            key={'removeTemplateButton'}
                            label={t('documentsManagement.deleteTemplate')}
                            onClick={() => {
                                if (ctx.row.original.id != undefined) {
                                    setDocumentDeleteTemplate(documentsData.find((d) => d.id == ctx.row.original.id))
                                }
                                closePopup()
                            }}
                        />,
                    ]}
                />
            ),
        },
    ]

    const tabInfo: React.ReactNode = (
        <>
            <InformationGridRow label={t('documentsManagement.name')} value={i18n.language == 'sk' ? infoData.name : infoData.nameEng} />
            <InformationGridRow
                label={t('documentsManagement.description')}
                value={i18n.language == 'sk' ? infoData.description : infoData.descriptionEng}
            />
        </>
    )

    const tabList: Tab[] = [
        {
            id: 'infoCard',
            title: t('documentsManagement.baseInfo'),
            content: tabInfo,
        },
    ]

    const deleteGroupDocument = (id: number) => {
        deleteDocumentGroup(id)
        setDeleteGroupModalOpen(false)
        refetchInfoData()
        queryClient.invalidateQueries([GET_DOCUMENT_GROUPS_QUERY_KEY])
        setIsActionSuccess({ value: true, path: `${AdminRouteNames.DOCUMENTS_MANAGEMENT}`, additionalInfo: { type: 'delete' } })
        navigate(AdminRouteNames.DOCUMENTS_MANAGEMENT, { state: { from: location } })
    }

    const deleteDocumentModal = async (id: number) => {
        await deleteDocument(id)
        setDocumentToDelete(undefined)
        refetchDocuments()
    }

    const resetSelectedColumns = () => {
        setSelectedColumns(documentsManagementGroupDocumentsDefaultSelectedColumns(t))
    }

    const [isUploading, setIsUploading] = useState(false)
    const handleUploadData = useCallback(() => {
        fileUploadRef.current?.startUploading()
    }, [])

    const fileMetaAttributes = {
        'x-content-uuid': uuidV4(),
        refAttributes: new Blob(
            [
                JSON.stringify({
                    refType: 'DOCUMENT_TEMPLATE',
                    refDocumentTemplateId: documentToAddTemplate?.id,
                }),
            ],
            { type: 'application/json' },
        ),
    }
    const { handleSubmit } = useForm()
    const onTemplateUpload = () => {
        if (fileUploadRef.current?.getFilesToUpload()?.length ?? 0 > 0) {
            setIsUploading(true)
            handleUploadData()
            return
        }
    }

    useEffect(() => {
        scrollToMutationFeedback()
        if (isActionSuccess.value && (isActionSuccess?.additionalInfo?.type == 'create' || isActionSuccess?.additionalInfo?.type == 'edit')) {
            refetchDocuments()
        }
    }, [infoData, isActionSuccess, refetchDocuments, scrollToMutationFeedback, isDocumentSuccessfullyUpdated, isDocumentUpdatingError])

    return (
        <>
            <ButtonGroupRow>
                <TextHeading size="L">{t('documentsManagement.heading')}</TextHeading>
                <div style={{ marginLeft: 'auto' }} />
                <Button label={t('documentsManagement.edit')} onClick={() => navigate('./edit')} />
                <Button
                    label={t('documentsManagement.delete')}
                    variant="warning"
                    onClick={() => setDeleteGroupModalOpen(true)}
                    disabled={documentsData.length !== 0}
                />
                {documentsData.length !== 0 && <Tooltip descriptionElement={t('documentsManagement.deleteTooltip')} />}
            </ButtonGroupRow>
            <MutationFeedback
                success={isActionSuccess.value && isActionSuccess?.additionalInfo?.type == 'editGroup'}
                successMessage={t('mutationFeedback.successfulUpdated')}
            />

            <Tabs tabList={tabList} />
            <TextHeading size="L">{t('documentsManagement.documents')}</TextHeading>
            <ActionsOverTable
                pagination={{ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE, dataLength: 0 }}
                entityName={''}
                simpleTableColumnsSelect={{
                    selectedColumns,
                    resetSelectedColumns,
                    saveSelectedColumns: setSelectedColumns,
                }}
            >
                <Button
                    bottomMargin={false}
                    label={t('documentsManagement.addNewDocument')}
                    onClick={() => navigate(`./create`, { state: { from: location } })}
                />
            </ActionsOverTable>
            <div ref={wrapperRef}>
                <MutationFeedback
                    success={
                        isActionSuccess.value &&
                        (isActionSuccess?.additionalInfo?.type == 'create' || isActionSuccess?.additionalInfo?.type == 'edit')
                    }
                    successMessage={
                        isActionSuccess?.additionalInfo?.type == 'create'
                            ? t('mutationFeedback.successfulCreated')
                            : t('mutationFeedback.successfulUpdated')
                    }
                />
                <MutationFeedback
                    success={isDocumentSuccessfullyUpdated && !isTemplateSuccessfullyDeleted && !isTemplateDeleting}
                    successMessage={t('documentsManagement.templateSuccessfullyAdded')}
                />
                <MutationFeedback success={isTemplateSuccessfullyDeleted} successMessage={t('documentsManagement.templateSuccessfullyDeleted')} />
            </div>
            <Table
                columns={columns.filter(
                    (c) =>
                        selectedColumns
                            .filter((s) => s.selected == true)
                            .map((s) => s.technicalName)
                            .includes(c.id ?? '') || c.id == 'actions',
                )}
                data={documentsData}
                sort={filter.sort}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <BaseModal isOpen={deleteGroupModalOpen} close={() => setDeleteGroupModalOpen(false)}>
                <TextHeading size="L">{t('documentsManagement.removingDocumentsGroup')}</TextHeading>
                <TextBody>{i18n.language == 'sk' ? infoData.name : infoData.nameEng}</TextBody>

                <ModalButtons
                    submitButtonLabel={t('codelists.remove')}
                    onSubmit={() => deleteGroupDocument(infoData.id ?? 0)}
                    closeButtonLabel={t('codelists.cancel')}
                    onClose={() => setDeleteGroupModalOpen(false)}
                />
            </BaseModal>

            <BaseModal isOpen={!!documentToDelete} close={() => setDocumentToDelete(undefined)}>
                <TextHeading size="L">{t('documentsManagement.removingDocument')}</TextHeading>
                <TextBody>{i18n.language == 'sk' ? documentToDelete?.name : documentToDelete?.nameEng}</TextBody>
                <TextBody>{i18n.language == 'sk' ? documentToDelete?.description : documentToDelete?.descriptionEng}</TextBody>

                <ModalButtons
                    submitButtonLabel={t('codelists.remove')}
                    onSubmit={() => deleteDocumentModal(documentToDelete?.id ?? 0)}
                    closeButtonLabel={t('codelists.cancel')}
                    onClose={() => setDocumentToDelete(undefined)}
                />
            </BaseModal>

            <BaseModal isOpen={!!documentToAddTemplate} close={() => setDocumentToAddTemplate(undefined)}>
                <QueryFeedback loading={isDocumentUpdating || isUploading} error={isDocumentUpdatingError} withChildren>
                    <TextHeading size="L">{t('documentsManagement.uploadTemplate')}</TextHeading>
                    <form onSubmit={handleSubmit(onTemplateUpload)} noValidate>
                        <FileUpload
                            ref={fileUploadRef}
                            allowedFileTypes={['.txt', '.rtf', '.pdf', '.doc', '.docx', '.xcl', '.xclx', '.jpg', '.png', '.gif', '.csv']}
                            fileMetaAttributes={fileMetaAttributes}
                            isUsingUuidInFilePath
                            onUploadSuccess={async (value) => {
                                setIsUploading(false)
                                updateDocument({ data: { ...documentToAddTemplate, templateUuid: value.at(0)?.fileId } }).then(() => {
                                    setDocumentToAddTemplate(undefined)
                                })
                            }}
                            onFileUploadFailed={() => setIsUploading(false)}
                            multiple={false}
                            refType={RefAttributesRefType.CI}
                        />
                        <ModalButtons
                            submitButtonLabel={t('codelists.save')}
                            closeButtonLabel={t('codelists.cancel')}
                            onClose={() => setDocumentToAddTemplate(undefined)}
                        />
                    </form>
                </QueryFeedback>
            </BaseModal>

            <BaseModal isOpen={!!documentDeleteTemplate} close={() => setDocumentDeleteTemplate(undefined)}>
                <QueryFeedback
                    loading={isTemplateDeleting || isDocumentUpdating}
                    error={isTemplateDeletingError || isDocumentUpdatingError}
                    withChildren
                >
                    <TextHeading size="L">{t('documentsManagement.deleteTemplateText')}</TextHeading>
                    <ModalButtons
                        submitButtonLabel={t('codelists.remove')}
                        onSubmit={async () => {
                            await updateDocument({ data: { ...documentDeleteTemplate, templateUuid: undefined } }).then((resp) => {
                                if (resp && documentDeleteTemplate?.templateUuid) {
                                    deleteTemplate({ uuid: documentDeleteTemplate?.templateUuid }).then(() => {
                                        setDocumentDeleteTemplate(undefined)
                                    })
                                }
                            })
                        }}
                        closeButtonLabel={t('codelists.cancel')}
                        onClose={() => setDocumentDeleteTemplate(undefined)}
                    />
                </QueryFeedback>
            </BaseModal>
        </>
    )
}

import { BaseModal, Button, ButtonGroupRow, ButtonLink, Tab, Table, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Document } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { ActionsOverTable, MutationFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import styles from './styles.module.scss'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const DocumentsGroupView: React.FC<IView> = ({
    infoData,
    documentsData,
    deleteDocumentGroup,
    deleteDocument,
    refetchDocuments,
    filter,
    handleFilterChange,
    selectedColumns,
    setSelectedColumns,
    resetSelectedColumns,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false)
    const [documentToDelete, setDocumentToDelete] = useState<Document>()

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
            enableSorting: true,
            id: 'name',
        },
        {
            header: t('documentsManagement.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
        },
        {
            header: t('documentsManagement.nameEng'),
            accessorFn: (row) => row?.nameEng,
            enableSorting: true,
            id: 'nameEng',
        },
        {
            header: t('documentsManagement.descriptionEng'),
            accessorFn: (row) => row.descriptionEng,
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
            header: t('documentsManagement.confluence'),
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
            header: '',
            accessorKey: 'remove',
            id: 'remove',
            cell: (ctx) => {
                return (
                    <>
                        <Link to={'./' + ctx?.row?.original?.id + '/edit'} state={{ from: location }}>
                            {t('codelists.edit')}
                        </Link>
                        <ButtonLink
                            className={styles.deleteButton}
                            label={t('codelists.remove')}
                            onClick={() => {
                                if (ctx.row.original.id != undefined) {
                                    setDocumentToDelete(documentsData.find((d) => d.id == ctx.row.original.id))
                                }
                            }}
                        />
                    </>
                )
            },
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
        navigate(-1)
    }

    const deleteDocumentModal = (id: number) => {
        deleteDocument(id)
        setDocumentToDelete(undefined)
        refetchDocuments()
    }
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        scrollToMutationFeedback()
        if (isActionSuccess.value) {
            refetchDocuments()
        }
    }, [isActionSuccess, refetchDocuments, scrollToMutationFeedback])

    return (
        <>
            <ButtonGroupRow>
                <TextHeading size="L">{t('documentsManagement.heading')}</TextHeading>
                <div style={{ marginLeft: 'auto' }} />
                <Button label={t('documentsManagement.edit')} onClick={() => navigate('./edit')} />
                <Button label={t('documentsManagement.delete')} variant="warning" onClick={() => setDeleteGroupModalOpen(true)} />
            </ButtonGroupRow>
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
                    success={isActionSuccess.value}
                    error={undefined}
                    successMessage={
                        isActionSuccess?.additionalInfo?.type == 'create'
                            ? t('mutationFeedback.successfulCreated')
                            : t('mutationFeedback.successfulUpdated')
                    }
                />
            </div>
            <Table
                columns={columns.filter(
                    (c) =>
                        selectedColumns
                            .filter((s) => s.selected == true)
                            .map((s) => s.technicalName)
                            .includes(c.id ?? '') || c.id == 'remove',
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
                <div className={styles.buttonGroupEnd}>
                    <Button onClick={() => setDeleteGroupModalOpen(false)} label={t('codelists.cancel')} variant="secondary" />
                    <Button onClick={() => deleteGroupDocument(infoData.id ?? 0)} label={t('codelists.delete')} type="submit" />
                </div>
            </BaseModal>

            <BaseModal isOpen={!!documentToDelete} close={() => setDocumentToDelete(undefined)}>
                <TextHeading size="L">{t('documentsManagement.removingDocument')}</TextHeading>
                <TextBody>{i18n.language == 'sk' ? documentToDelete?.name : documentToDelete?.nameEng}</TextBody>
                <TextBody>{i18n.language == 'sk' ? documentToDelete?.description : documentToDelete?.descriptionEng}</TextBody>
                <div className={styles.buttonGroupEnd}>
                    <Button onClick={() => setDocumentToDelete(undefined)} label={t('codelists.cancel')} variant="secondary" />
                    <Button onClick={() => deleteDocumentModal(infoData.id ?? 0)} label={t('codelists.delete')} type="submit" />
                </div>
            </BaseModal>
        </>
    )
}

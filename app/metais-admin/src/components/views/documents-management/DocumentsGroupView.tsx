import { Filter } from '@isdd/idsk-ui-kit/filter'
import { BaseModal, Button, ButtonGroupRow, ButtonPopup, Tab, Table, Tabs, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Document } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ActionsOverTable, BulkPopup } from '@isdd/metais-common/index'
import { useState } from 'react'

import styles from './styles.module.scss'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const DocumentsGroupView: React.FC<IView> = ({ infoData, documentsData, deleteDocument }) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false)

    documentsData = [
        {
            id: 69,
            name: 'Test123',
            nameEng: 'Test123',
            description: 'Description123',
            descriptionEng: 'Description123',
            required: true,
            confluence: true,
            type: '123',
            position: 0,
            documentGroup: {
                id: 19,
            },
        },
    ]
    const entityName = 'documentsGroup'

    const columns: Array<ColumnDef<Document>> = [
        {
            header: t('documentsManagement.name'),
            accessorFn: (row) => row?.documentGroup?.id,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => (
                <Link to={'./' + ctx?.row?.original?.id} state={{ from: location }}>
                    {ctx?.row?.original?.name}
                </Link>
            ),
        },
        {
            header: t('documentsManagement.description'),
            accessorFn: (row) =>
                i18n.language == 'sk' && row.descriptionEng != undefined && row.descriptionEng.length > 0 ? row?.description : row.descriptionEng,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => ctx?.getValue?.() as string,
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
                    <Link to={'#'} onClick={() => console.log('delete')} state={{ from: location }}>
                        Odstranit
                    </Link>
                )
            },
        },
    ]

    const tabInfo: React.ReactNode = (
        <>
            <InformationGridRow label="Nazov" value={i18n.language == 'sk' ? infoData.name : infoData.nameEng} />
            <InformationGridRow label="Popis" value={i18n.language == 'sk' ? infoData.description : infoData.descriptionEng} />
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
        deleteDocument(id)
        setDeleteGroupModalOpen(false)
        navigate(-1)
    }

    return (
        <>
            <ButtonGroupRow>
                <TextHeading size="L">{t('documentsManagement.heading')}</TextHeading>
                <div style={{ marginLeft: 'auto' }} />
                <Button label="Edit" onClick={() => navigate('./edit')} />
                <Button label="Delete" variant="warning" onClick={() => setDeleteGroupModalOpen(true)} />
                <ButtonPopup buttonLabel="Other options" popupContent={() => null} />
            </ButtonGroupRow>
            <Tabs tabList={tabList} />
            <TextHeading size="L">{t('documentsManagement.documents')}</TextHeading>
            <Filter form={() => <></>} defaultFilterValues={{}} />
            <ActionsOverTable entityName={''}>
                <Button
                    bottomMargin={false}
                    label={t('documentsManagement.addNewDocument')}
                    onClick={() => navigate(`./create`, { state: { from: location } })}
                />
            </ActionsOverTable>
            <Table columns={columns} data={documentsData} />
            <BaseModal isOpen={deleteGroupModalOpen} close={() => setDeleteGroupModalOpen(false)}>
                <TextHeading size="L">{t('documentsManagement.removingDocumentsGroup')}</TextHeading>
                <TextBody>{i18n.language == 'sk' ? infoData.name : infoData.nameEng}</TextBody>
                <div className={styles.buttonGroupEnd}>
                    <Button onClick={() => setDeleteGroupModalOpen(false)} label={t('codelists.cancel')} variant="secondary" />
                    <Button onClick={() => deleteGroupDocument(infoData.id ?? 0)} label={t('codelists.delete')} type="submit" />
                </div>
            </BaseModal>
        </>
    )
}

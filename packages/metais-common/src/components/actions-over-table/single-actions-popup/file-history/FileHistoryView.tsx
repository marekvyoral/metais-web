import { LoadingIndicator, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/src/page-size-select/PageSizeSelect'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { formatBytes } from '@isdd/metais-common/components/file-import/fileImportUtils'
import { ConfigurationItemUi, MetaVersion, useGetContentHook } from '@isdd/metais-common/api'
import { formatDateTimeForDefaultValue } from '@isdd/metais-common/componentHelpers/formatting/formatDateUtils'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface IFileHistoryViewProps {
    item: ConfigurationItemUi
    data: MetaVersion[]
    isLoading: boolean
    onClose: () => void
    handlePagingSelect?: (page: string) => void
    namesData?: { login: string; fullName: string }[]
}

export const FileHistoryView: React.FC<IFileHistoryViewProps> = ({ data, item, handlePagingSelect, isLoading, namesData }) => {
    const { t } = useTranslation()
    const downloadVersionFile = useGetContentHook()
    const [isFileLoading, setFileLoading] = useState<boolean>(false)
    const downloadFile = async (row: Row<MetaVersion>) => {
        const blobData = await downloadVersionFile(item.uuid ?? '', { version: data[row.index].version })
        downloadBlobAsFile(new Blob([blobData]), data[row.index].filename ?? '')
        setFileLoading(false)
    }
    const { state: authState } = useAuth()
    const isUserLogged = authState.user !== null
    const columns: ColumnDef<MetaVersion>[] = [
        {
            header: t('fileHistory.filename'),
            id: 'filename',
            accessorKey: 'filename',
            size: 200,
            cell: (cell) => (
                <Link to="#" onClick={() => downloadFile(cell.row)}>
                    {cell.getValue() as string}{' '}
                </Link>
            ),
        },
        {
            header: t('fileHistory.version'),
            id: 'version',
            accessorKey: 'version',
            size: 45,
        },
        {
            header: t('fileHistory.mimeType'),
            id: 'mimeType',
            accessorKey: 'mimeType',
            size: 200,
        },
        {
            header: t('fileHistory.contentLength'),
            id: 'contentLength',
            accessorKey: 'contentLength',
            cell: (cellItem) => {
                return <p>{formatBytes(cellItem.cell.getValue() as number)}</p>
            },
        },
        {
            header: t('fileHistory.validFrom'),
            id: 'validFrom',
            accessorKey: 'validFrom',
            cell: (cellItem) => {
                const i = cellItem.row.index
                return <p>{formatDateTimeForDefaultValue(data[i].lastModified ?? '')}</p>
            },
        },
        {
            header: t('fileHistory.validTo'),
            id: 'validTo',
            accessorKey: 'validTo',
            cell: (cellItem) => {
                if (cellItem.row.index + 1 === data.length) {
                    return <p>{t('fileHistory.actualVersion')}</p>
                } else {
                    return <p>{formatDateTimeForDefaultValue(data[cellItem.row.index + 1].lastModified ?? '')}</p>
                }
            },
        },
        {
            header: t('fileHistory.lastModifiedBy'),
            id: 'lastModifiedBy',
            accessorKey: 'lastModifiedBy',
            cell: (cellItem) => namesData?.find((namesItem) => namesItem.login == (cellItem.getValue() as string))?.fullName,
        },
    ]
    const filteredColumns = isUserLogged ? columns : columns.filter((column) => column.id !== 'lastModifiedBy')
    return (
        <div>
            {(isLoading || isFileLoading) && <LoadingIndicator label={t('form.waitSending')} />}
            <TextHeading size="L">{t('fileHistory.documentHistory')}</TextHeading>
            <div className={styles.centerText}>
                <TextBody className={styles.marginBottom0}>{item.attributes?.Gen_Profil_nazov}</TextBody>
                <PageSizeSelect id="pageSizeSelect" className={styles.selectGroup} handlePagingSelect={handlePagingSelect} />
            </div>
            <Table<MetaVersion> data={data} columns={filteredColumns} />
        </div>
    )
}

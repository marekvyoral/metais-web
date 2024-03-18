import { LoadingIndicator, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { PageSizeSelect } from '@isdd/idsk-ui-kit/src/page-size-select/PageSizeSelect'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { MetaVersion, useGetContentHook } from '@isdd/metais-common/api/generated/dms-swagger'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { formatBytes } from '@isdd/metais-common/components/file-import/fileImportUtils'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface IFileHistoryViewProps {
    item: ConfigurationItemUi
    data: MetaVersion[]
    isLoading: boolean
    onClose: () => void
    handlePagingSelect?: (page: string) => void
    namesData?: { login: string; fullName: string }[]
}

export const FileHistoryView: React.FC<IFileHistoryViewProps> = ({ data, item, handlePagingSelect, isLoading, namesData, onClose }) => {
    const { t } = useTranslation()
    const downloadVersionFile = useGetContentHook()
    const [isFileLoading, setFileLoading] = useState<boolean>(false)
    const downloadFile = async (row: Row<MetaVersion>) => {
        const blobData = await downloadVersionFile(item.uuid ?? '', { version: data[row.index].version })
        downloadBlobAsFile(new Blob([blobData]), data[row.index].filename ?? '', false)
        setFileLoading(false)
    }
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = user !== null
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
                return <p>{t('dateTime', { date: data[i].lastModified ?? '' })}</p>
            },
        },
        {
            header: t('fileHistory.validTo'),
            id: 'validTo',
            accessorKey: 'validTo',
            cell: (cellItem) => (
                <p>
                    {cellItem.row.index + 1 === data.length
                        ? t('fileHistory.actualVersion')
                        : t('dateTime', { date: data[cellItem.row.index + 1].lastModified ?? '' })}
                </p>
            ),
        },
        ...(isUserLogged
            ? [
                  {
                      header: t('fileHistory.lastModifiedBy'),
                      id: 'lastModifiedBy',
                      accessorKey: 'lastModifiedBy',
                      cell: (cellItem) => namesData?.find((namesItem) => namesItem.login == (cellItem.getValue() as string))?.fullName,
                  } as ColumnDef<MetaVersion>,
              ]
            : []),
    ]
    return (
        <div>
            {(isLoading || isFileLoading) && <LoadingIndicator label={t('form.waitSending')} />}
            <TextHeading size="L">{t('fileHistory.documentHistory')}</TextHeading>
            <div className={styles.centerText}>
                <TextBody className={styles.marginBottom0}>{item.attributes?.Gen_Profil_nazov}</TextBody>
                <PageSizeSelect className={styles.selectGroup} handlePagingSelect={handlePagingSelect} />
            </div>
            <Table<MetaVersion> data={data} columns={columns} />
            <ModalButtons onClose={onClose} />
        </div>
    )
}

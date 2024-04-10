import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import { ExportIcon } from '@isdd/metais-common/assets/images'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { ExportItemsOrRelations } from '@isdd/metais-common/components/export-items-or-relations/ExportItemsOrRelations'
import { ReportExecute } from '@isdd/metais-common/api/generated/report-swagger'
import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table'
import { useExportCsv5Hook, useExportExcel5Hook, useExportXml5Hook } from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'
import { downloadBlobAsFile, generateExportFileName } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
interface IExportButtonProps {
    entityId: number
    entityName: string
    filter: ReportExecute
}

export const ReportExportButton: React.FC<IExportButtonProps> = ({ entityId, entityName, filter }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()

    const exportCsv = useExportCsv5Hook()
    const exportXml = useExportXml5Hook()
    const exportExcel = useExportExcel5Hook()

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState(false)

    const openModal = () => {
        setModalOpen(true)
    }

    const onClose = () => {
        setModalOpen(false)
    }

    const exportAndDownloadBlob = async (
        exportFunction: (reportId: number, reportExecute: ReportExecute) => Promise<Blob>,
        extension: FileExtensionEnum,
    ) => {
        const blobData = await exportFunction(entityId, filter)
        downloadBlobAsFile(new Blob([blobData]), generateExportFileName(entityName, extension, false), false)
        setLoading(false)
        onClose()
    }

    const onExportStart = (exportValue: string, extension: FileExtensionEnum) => {
        setLoading(true)
        setIsError(false)
        switch (extension) {
            case FileExtensionEnum.XML:
                exportAndDownloadBlob(exportXml, extension)
                    .then(() => {
                        setLoading(false)
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
                break
            case FileExtensionEnum.CSV:
                exportAndDownloadBlob(exportCsv, extension)
                    .then(() => {
                        setLoading(false)
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
                break
            case FileExtensionEnum.XLSX:
                exportAndDownloadBlob(exportExcel, extension)
                    .then(() => {
                        setLoading(false)
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
                break
        }
    }

    return (
        <>
            <Button
                onClick={openModal}
                className="marginBottom0"
                variant="secondary"
                label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
                aria-haspopup={'dialog'}
            />
            <ExportItemsOrRelations
                isOpen={modalOpen}
                isLoading={isLoading}
                isError={isError}
                close={onClose}
                onExportStart={onExportStart}
                hideRadioBtns
            />
        </>
    )
}

import { Button } from '@isdd/idsk-ui-kit/src/button/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import {
    CiFilterUi,
    CiListFilterContainerUi,
    useExportCsv3Hook,
    useExportExcel3Hook,
    useExportRelCsv1Hook,
    useExportRelExcel1Hook,
    useExportRelXml1Hook,
    useExportXml1Hook,
} from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'
import { ExportIcon } from '@isdd/metais-common/assets/images'
import { downloadBlobAsFile, generateExportFileName } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { ExportItemsOrRelations } from '@isdd/metais-common/components/export-items-or-relations/ExportItemsOrRelations'

export enum FileExtensionEnum {
    XML = 'XML',
    CSV = 'CSV',
    XLSX = 'XLSX',
    RDF = 'RDF',
}

export const ExportButton: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()
    const { entityName } = useParams()

    const [isLoading, setLoading] = useState<boolean>(false)

    const exportCsv = useExportCsv3Hook()
    const exportXml = useExportXml1Hook()
    const exportExcel = useExportExcel3Hook()

    const exportRelXml = useExportRelXml1Hook()
    const exportRelCsv = useExportRelCsv1Hook()
    const exportRelExcel = useExportRelExcel1Hook()

    const openModal = () => {
        setModalOpen(true)
    }

    const onClose = () => {
        setModalOpen(false)
    }

    const exportAndDownloadBlob = async (
        exportFunction: (ciListFilterContainerUi: CiListFilterContainerUi) => Promise<Blob>,
        extension: FileExtensionEnum,
        entity: string,
        filter: CiFilterUi,
    ) => {
        const blobData = await exportFunction({ filter })
        downloadBlobAsFile(new Blob([blobData]), generateExportFileName(entity, extension))
        setLoading(false)
        onClose()
    }
    const onExportStart = async (exportValue: string, extension: FileExtensionEnum) => {
        if (!entityName) return
        setLoading(true)
        const filter = {
            type: [entityName],
            metaAttributes: { state: ['DRAFT'] },
        }

        if (exportValue === 'items') {
            if (extension === FileExtensionEnum.XML) {
                exportAndDownloadBlob(exportXml, FileExtensionEnum.XML, entityName, filter)
            } else if (extension === FileExtensionEnum.CSV) {
                exportAndDownloadBlob(exportCsv, FileExtensionEnum.XML, entityName, filter)
            } else if (extension === FileExtensionEnum.XLSX) {
                exportAndDownloadBlob(exportExcel, FileExtensionEnum.XML, entityName, filter)
            }
        }
        if (exportValue === 'relations') {
            if (extension === FileExtensionEnum.XML) {
                exportAndDownloadBlob(exportRelXml, FileExtensionEnum.XML, entityName, filter)
            } else if (extension === FileExtensionEnum.CSV) {
                exportAndDownloadBlob(exportRelCsv, FileExtensionEnum.XML, entityName, filter)
            } else if (extension === FileExtensionEnum.XLSX) {
                exportAndDownloadBlob(exportRelExcel, FileExtensionEnum.XML, entityName, filter)
            }
        }
    }

    return (
        <>
            <Button
                onClick={openModal}
                className="marginBottom0"
                variant="secondary"
                label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} alt={t('exportItemsOrRelations.header')} />}
            />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} isLoading={isLoading} onExportStart={onExportStart} />
        </>
    )
}

import { Button } from '@isdd/idsk-ui-kit/src/button/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Pagination } from '@isdd/idsk-ui-kit/src/types'

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
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

export enum FileExtensionEnum {
    XML = 'XML',
    CSV = 'CSV',
    XLSX = 'XLSX',
    RDF = 'RDF',
}
export interface IExportButtonProps {
    pagination?: Pagination
}

export const ExportButton: React.FC<IExportButtonProps> = (pagination) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()
    const { entityName } = useParams()
    const { currentPreferences } = useUserPreferences()

    const [isLoading, setLoading] = useState<boolean>(false)

    const exportCsv = useExportCsv3Hook()
    const exportXml = useExportXml1Hook()
    const exportExcel = useExportExcel3Hook()

    const exportRelXml = useExportRelXml1Hook()
    const exportRelCsv = useExportRelCsv1Hook()
    const exportRelExcel = useExportRelExcel1Hook()
    const { setIsActionSuccess } = useActionSuccess()
    const [isError, setIsError] = useState(false)
    const openModal = () => {
        setModalOpen(true)
    }

    const onClose = () => {
        setModalOpen(false)
        setIsActionSuccess({ value: false, path: `/ci/${entityName}` })
        setIsError(false)
        setLoading(false)
    }

    const exportAndDownloadBlob = async (
        exportFunction: (ciListFilterContainerUi: CiListFilterContainerUi) => Promise<Blob>,
        extension: FileExtensionEnum,
        entity: string,
        filter: CiFilterUi,
    ) => {
        const blobData = await exportFunction({ filter })
        downloadBlobAsFile(new Blob([blobData]), generateExportFileName(entity, extension), false)
        setLoading(false)
        // onClose()
    }
    const onExportStart = async (exportValue: string, extension: FileExtensionEnum) => {
        if (!entityName) return
        setLoading(true)
        setIsError(false)
        setIsActionSuccess({ value: false, path: `/ci/${entityName}` })

        const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
        const filter = {
            type: [entityName],
            metaAttributes,
            page: pagination?.pagination?.pageNumber,
            perpage: pagination?.pagination?.pageSize,
        }

        if (exportValue === 'items') {
            if (extension === FileExtensionEnum.XML) {
                exportAndDownloadBlob(exportXml, FileExtensionEnum.XML, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
            } else if (extension === FileExtensionEnum.CSV) {
                exportAndDownloadBlob(exportCsv, FileExtensionEnum.CSV, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
            } else if (extension === FileExtensionEnum.XLSX) {
                exportAndDownloadBlob(exportExcel, FileExtensionEnum.XLSX, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
            }
        }
        if (exportValue === 'relations') {
            if (extension === FileExtensionEnum.XML) {
                exportAndDownloadBlob(exportRelXml, FileExtensionEnum.XML, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
            } else if (extension === FileExtensionEnum.CSV) {
                exportAndDownloadBlob(exportRelCsv, FileExtensionEnum.CSV, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
            } else if (extension === FileExtensionEnum.XLSX) {
                exportAndDownloadBlob(exportRelExcel, FileExtensionEnum.XLSX, entityName, filter)
                    .then(() => {
                        setIsActionSuccess({ value: true, path: `/ci/${entityName}` })
                    })
                    .catch(() => {
                        setIsError(true)
                        setLoading(false)
                    })
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

            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} isLoading={isLoading} onExportStart={onExportStart} isError={isError} />
        </>
    )
}

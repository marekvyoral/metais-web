import { Button } from '@isdd/idsk-ui-kit/src/button/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    useExportCsv3Hook,
    useExportExcel3Hook,
    useExportRelCsvHook,
    useExportRelExcelHook,
    useExportRelXmlHook,
    useExportXml1Hook,
} from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'
import { ExportIcon } from '@isdd/metais-common/assets/images'
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

    const exportCsv = useExportCsv3Hook()
    const exportXml = useExportXml1Hook()
    const exportExcel = useExportExcel3Hook()

    const exportRelXml = useExportRelXmlHook()
    const exportRelCsv = useExportRelCsvHook()
    const exportRelExcel = useExportRelExcelHook()

    const openModal = () => {
        setModalOpen(true)
    }

    const onClose = () => {
        setModalOpen(false)
    }

    const onExportStart = (exportValue: string, extension: FileExtensionEnum) => {
        if (exportValue === 'items') {
            if (extension === FileExtensionEnum.XML) {
                exportXml({
                    filter: {
                        type: ['ISVS'],
                        metaAttributes: { state: ['DRAFT'] },
                    },
                })
                return
            }
            if (extension === FileExtensionEnum.CSV) {
                exportCsv({
                    filter: {
                        type: ['ISVS'],
                        metaAttributes: { state: ['DRAFT'] },
                    },
                })

                return
            }
            if (extension === FileExtensionEnum.XLSX) {
                exportExcel({
                    filter: {
                        type: ['ISVS'],
                        metaAttributes: { state: ['DRAFT'] },
                    },
                })
                return
            }
        }
        if (exportValue === 'relations') {
            if (extension === FileExtensionEnum.XML) {
                exportRelXml({ filter: {} })
                return
            }
            if (extension === FileExtensionEnum.CSV) {
                exportRelCsv({ filter: {} })
                return
            }
            if (extension === FileExtensionEnum.XLSX) {
                exportRelExcel({ filter: {} })
                return
            }
        }
    }

    return (
        <>
            <Button
                onClick={openModal}
                className="marginBottom0"
                variant="secondary"
                label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
            />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart} />
        </>
    )
}

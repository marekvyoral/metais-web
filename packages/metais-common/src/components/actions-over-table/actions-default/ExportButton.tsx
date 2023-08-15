import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import { ExportIcon } from '@isdd/metais-common/assets/images'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { ExportItemsOrRelations } from '@isdd/metais-common/components/export-items-or-relations/ExportItemsOrRelations'
import {
    useExportCsvHook,
    useExportExcelHook,
    useExportRelCsvHook,
    useExportRelExcelHook,
    useExportRelXmlHook,
    useExportXmlHook,
} from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'

export enum FileExtensionEnum {
    XML = 'XML',
    CSV = 'CSV',
    XLSX = 'XLSX',
    RDF = 'RDF',
}

export const ExportButton: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()

    const exportCsv = useExportCsvHook()
    const exportXml = useExportXmlHook()
    const exportExcel = useExportExcelHook()

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
                    filter: {},
                })
                return
            }
            if (extension === FileExtensionEnum.CSV) {
                exportCsv({
                    serviceType: '',
                    project: '',
                    intervalStart: '',
                    intervalEnd: '',
                })
                return
            }
            if (extension === FileExtensionEnum.XLSX) {
                exportExcel({
                    serviceType: '',
                    project: '',
                    intervalStart: '',
                    intervalEnd: '',
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

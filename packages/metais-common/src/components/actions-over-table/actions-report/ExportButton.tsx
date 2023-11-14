import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'

import { ExportIcon } from '@isdd/metais-common/assets/images'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { ExportItemsOrRelations } from '@isdd/metais-common/components/export-items-or-relations/ExportItemsOrRelations'
import { useReportOnExportStart } from '@isdd/metais-common/componentHelpers'
import { ReportExecute } from '@isdd/metais-common/api/generated/report-swagger'

interface IExportButtonProps {
    entityId: number
    filter: ReportExecute
}

export const ReportExportButton: React.FC<IExportButtonProps> = ({ entityId, filter }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()

    const onExportStart = useReportOnExportStart()

    const openModal = () => {
        setModalOpen(true)
    }

    const onClose = () => {
        setModalOpen(false)
    }

    return (
        <>
            <Button
                onClick={openModal}
                className="marginBottom0"
                variant="secondary"
                label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
            />
            <ExportItemsOrRelations isOpen={modalOpen} close={onClose} onExportStart={onExportStart(entityId, filter)} />
        </>
    )
}

import { BaseModal, LoadingIndicator, TextHeading } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/src/button/Button'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'
import { useExportCsv6, useExportExcel6, useExportXml6 } from '@isdd/metais-common/api/generated/impexp-cmdb-swagger'
import { ExportIcon } from '@isdd/metais-common/assets/images'
import { downloadBlobAsFile } from '@isdd/metais-common/componentHelpers/download/downloadHelper'
import { IconLabel } from '@isdd/metais-common/components/actions-over-table/icon-label/IconLabel'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { sanitizeFileName } from '@isdd/metais-common/utils/utils'

interface IExportButtonProps {
    trainingUuid: string
    trainingName: string
}

export const TrainingExportButton: React.FC<IExportButtonProps> = ({ trainingUuid, trainingName }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const { t } = useTranslation()

    const { mutateAsync: exportXml, isLoading: isLoadingExportXML, error: errorXML, reset: resetXML } = useExportXml6()
    const { mutateAsync: exportExcel, isLoading: isLoadingExportExcel, error: errorExcel, reset: resetExcel } = useExportExcel6()
    const { mutateAsync: exportCsv, isLoading: isLoadingExportCSV, error: errorCSV, reset: resetCSV } = useExportCsv6()
    const [exportSuccess, setExportSuccess] = useState(false)

    const onExportStart = async (extension: FileExtensionEnum) => {
        setExportSuccess(false)
        resetCSV()
        resetExcel()
        resetXML()
        let exportFunction = exportExcel
        switch (extension) {
            case FileExtensionEnum.XML:
                exportFunction = exportXml
                break
            case FileExtensionEnum.CSV:
                exportFunction = exportCsv
                break
        }
        try {
            const dataFile = await exportFunction({ params: { trainingUuid } })
            downloadBlobAsFile(new Blob([dataFile]), `${sanitizeFileName(trainingName)}.${extension.toLowerCase()}`, false)
            setExportSuccess(true)
        } catch (error) {
            setExportSuccess(false)
        }
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const isLoading = [isLoadingExportCSV, isLoadingExportExcel, isLoadingExportXML].some((item) => item)
    const isError = [errorXML, errorExcel, errorCSV].some((item) => item)

    return (
        <>
            <Button
                onClick={() => setModalOpen(true)}
                className="marginBottom0"
                variant="secondary"
                aria-label={t('trainings.exportAria')}
                label={<IconLabel label={t('actionOverTable.export')} icon={ExportIcon} />}
            />
            <BaseModal isOpen={modalOpen} close={closeModal}>
                {isLoading && <LoadingIndicator label={t('exportItemsOrRelations.loading')} />}
                <MutationFeedback
                    success={exportSuccess}
                    showSupportEmail
                    error={isError ? t('feedback.mutationErrorMessage') : undefined}
                    successMessage={t('exportItemsOrRelations.exportSuccess')}
                />
                <div className={styles.modalContainer}>
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <img className={styles.iconWidth} src={ExportIcon} alt="" />
                        </div>
                        <TextHeading size={'L'} className={styles.heading}>
                            {t('trainings.export-title')}
                        </TextHeading>
                        <div className={styles.buttonGroup}>
                            <Button
                                label={t('exportItemsOrRelations.buttonXML')}
                                variant="secondary"
                                className={styles.buttons}
                                onClick={() => onExportStart(FileExtensionEnum.XML)}
                            />
                            <Button
                                label={t('exportItemsOrRelations.buttonCSV')}
                                variant="secondary"
                                className={styles.buttons}
                                onClick={() => onExportStart(FileExtensionEnum.CSV)}
                            />
                            <Button
                                label={t('exportItemsOrRelations.buttonXLSX')}
                                variant="secondary"
                                className={styles.buttons}
                                onClick={() => onExportStart(FileExtensionEnum.XLSX)}
                            />
                        </div>
                    </div>
                </div>
                <ModalButtons onClose={closeModal} />
            </BaseModal>
        </>
    )
}

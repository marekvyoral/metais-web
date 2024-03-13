import { LoadingIndicator } from '@isdd/idsk-ui-kit'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { RadioButtonGroup } from '@isdd/idsk-ui-kit/radio-button-group/RadioButtonGroup'
import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MutationFeedback } from '../mutation-feedback/MutationFeedback'
import { ModalButtons } from '../modal-buttons/ModalButtons'

import styles from './exportItemsOrRelations.module.scss'

import { ExportIcon } from '@isdd/metais-common/assets/images'
import { FileExtensionEnum } from '@isdd/metais-common/components/actions-over-table/actions-default/ExportButton'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

interface IExportItemsOrRelationsProps {
    isOpen: boolean
    className?: string
    isLoading?: boolean
    close: () => void
    onExportStart: (exportValue: string, extension: FileExtensionEnum) => void
    isError?: boolean
}

export const ExportItemsOrRelations: React.FC<IExportItemsOrRelationsProps> = ({ isOpen, isLoading, close, onExportStart, isError }) => {
    const { t } = useTranslation()
    const [exportValue, setExportValue] = useState('')
    const { isActionSuccess } = useActionSuccess()
    const startExport = (extension: FileExtensionEnum) => {
        if (!exportValue) return
        onExportStart(exportValue, extension)
        // close()
    }

    return (
        <BaseModal isOpen={isOpen} close={close}>
            {isLoading && <LoadingIndicator label={t('exportItemsOrRelations.loading')} />}
            <MutationFeedback success={isActionSuccess.value} error={isError} successMessage={t('exportItemsOrRelations.exportSuccess')} />
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <img className={styles.iconWidth} src={ExportIcon} alt="" />
                    </div>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t('exportItemsOrRelations.header')}
                    </TextHeading>
                    <div className="govuk-radios--small">
                        <RadioButtonGroup inline>
                            <RadioButton
                                id={'id1'}
                                name={'RadioButton'}
                                value={'RadioButton'}
                                label={t('exportItemsOrRelations.items')}
                                onChange={() => setExportValue('items')}
                            />
                            <RadioButton
                                id={'id2'}
                                name={'RadioButton'}
                                value={'RadioButton'}
                                label={t('exportItemsOrRelations.relations')}
                                onChange={() => setExportValue('relations')}
                            />
                        </RadioButtonGroup>
                    </div>
                    <div className={styles.buttonGroup}>
                        <Button
                            label={t('exportItemsOrRelations.buttonXML')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(FileExtensionEnum.XML)}
                        />
                        <Button
                            label={t('exportItemsOrRelations.buttonCSV')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(FileExtensionEnum.CSV)}
                        />
                        <Button
                            label={t('exportItemsOrRelations.buttonXLSX')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport(FileExtensionEnum.XLSX)}
                        />
                    </div>
                </div>
            </div>
            <ModalButtons onClose={close} />
        </BaseModal>
    )
}

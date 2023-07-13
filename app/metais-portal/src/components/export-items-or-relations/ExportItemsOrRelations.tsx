import React, { useState } from 'react'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'
import { RadioButtonGroup } from '@isdd/idsk-ui-kit/radio-button-group/RadioButtonGroup'

import styles from './exportItemsOrRelations.module.scss'

import { ExportIcon } from '@/assets/images'

interface IExportItemsOrRelationsProps {
    isOpen: boolean
    className?: string
    close: () => void
    onExportStart: (exportValue: string, extension: string) => void
}

export const ExportItemsOrRelations: React.FC<IExportItemsOrRelationsProps> = ({ isOpen, close, onExportStart }) => {
    const { t } = useTranslation()
    const [exportValue, setExportValue] = useState<string>('')
    const startExport = (extension: string) => {
        if (!exportValue) return
        onExportStart(exportValue, extension)
        close()
    }
    return (
        <BaseModal isOpen={isOpen} close={close}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <img className={styles.iconWidth} src={ExportIcon} alt="export-icon" />
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
                            label={t('exportItemsOrRelations.buttonRDF')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport('RDF')}
                        />
                        <Button
                            label={t('exportItemsOrRelations.buttonXML')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport('XML')}
                        />
                        <Button
                            label={t('exportItemsOrRelations.buttonCSV')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport('CSV')}
                        />
                        <Button
                            label={t('exportItemsOrRelations.buttonXLSX')}
                            variant="secondary"
                            className={styles.buttons}
                            onClick={() => startExport('XLSX')}
                        />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}

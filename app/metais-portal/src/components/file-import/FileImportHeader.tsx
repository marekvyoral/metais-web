import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ExportIcon } from '@isdd/metais-common/assets/images'
import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'

import styles from './FileImport.module.scss'
interface IFileImportHeader {
    setRadioButtonMetaData: React.Dispatch<React.SetStateAction<string>>
}

export const FileImportHeader: React.FC<IFileImportHeader> = ({ setRadioButtonMetaData }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.headerWrapper}>
            <img src={ExportIcon} />
            <TextHeading size="L">{t('fileImport.header')}</TextHeading>

            <div>
                <RadioButton
                    label={t('fileImport.onlyExisting')}
                    id="existing-only"
                    name="import-radio-button"
                    value="existing-only"
                    defaultChecked
                    onChange={(event) => setRadioButtonMetaData(event.currentTarget.value)}
                    className="govuk-radios--small"
                />
                <RadioButton
                    label={t('fileImport.existingAndNew')}
                    id="existing-and-new"
                    name="import-radio-button"
                    value="existing-and-new"
                    onChange={(event) => setRadioButtonMetaData(event.currentTarget.value)}
                    className="govuk-radios--small"
                />
            </div>
        </div>
    )
}

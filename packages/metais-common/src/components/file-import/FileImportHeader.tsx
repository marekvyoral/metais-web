import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'

import styles from './FileImport.module.scss'

import { ExportIcon } from '@isdd/metais-common/assets/images'

export enum FileImportEditOptions {
    EXISTING_ONLY = 'existing-only',
    EXISTING_AND_NEW = 'existing-and-new',
}

interface IFileImportHeader {
    setRadioButtonMetaData: React.Dispatch<React.SetStateAction<FileImportEditOptions>>
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
                    id={FileImportEditOptions.EXISTING_ONLY}
                    name="import-radio-button"
                    value={FileImportEditOptions.EXISTING_ONLY}
                    defaultChecked
                    onChange={() => setRadioButtonMetaData(FileImportEditOptions.EXISTING_ONLY)}
                    className="govuk-radios--small"
                />
                <RadioButton
                    label={t('fileImport.existingAndNew')}
                    id={FileImportEditOptions.EXISTING_AND_NEW}
                    name="import-radio-button"
                    value={FileImportEditOptions.EXISTING_AND_NEW}
                    onChange={() => setRadioButtonMetaData(FileImportEditOptions.EXISTING_AND_NEW)}
                    className="govuk-radios--small"
                />
            </div>
        </div>
    )
}

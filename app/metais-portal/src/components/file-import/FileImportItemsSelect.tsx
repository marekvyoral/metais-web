import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleSelect } from '@isdd/idsk-ui-kit/index'

import styles from './FileImport.module.scss'
import { useReadCiListHook } from '@/api'

interface IFileImportItemsSelect {
    setRadioButtonMetaData?: React.Dispatch<React.SetStateAction<string>>
}

export const FileImportItemsSelect: React.FC<IFileImportItemsSelect> = ({ setRadioButtonMetaData }) => {
    const { t } = useTranslation()
    const getImplicitHierarchy = useReadCiListHook()
    const implicitHierarchy = getImplicitHierarchy({})
    console.log(implicitHierarchy)
    return (
        <div>
            <SimpleSelect label={'Povinna osoba'} id={''} options={[]} />
            <SimpleSelect label={'Rola'} id={''} options={[]} />
        </div>
    )
}

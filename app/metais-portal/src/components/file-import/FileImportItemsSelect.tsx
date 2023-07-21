import React from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleSelect } from '@isdd/idsk-ui-kit/index'

import styles from './FileImport.module.scss'
import { useReadCiListUsingPOST1 } from '@/api'

interface IFileImportItemsSelect {
    setRadioButtonMetaData?: React.Dispatch<React.SetStateAction<string>>
}

export const FileImportItemsSelect: React.FC<IFileImportItemsSelect> = ({ setRadioButtonMetaData }) => {
    const { t } = useTranslation()
    const getImplicitHierarchy = useReadCiListUsingPOST1()
    const implicitHierarchy = getImplicitHierarchy.mutateAsync({ data: {} })
    console.log(implicitHierarchy)
    return (
        <div>
            <SimpleSelect label={'Povinna osoba'} id={''} options={[]} />
            <SimpleSelect label={'Rola'} id={''} options={[]} />
        </div>
    )
}

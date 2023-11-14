import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './table.module.scss'

import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

interface TableInfoMessageProps {
    isEmptyRows: boolean
    error?: boolean
}

export const TableInfoMessage = ({ isEmptyRows, error }: TableInfoMessageProps): JSX.Element => {
    const { t } = useTranslation()

    if (error) {
        return <TextBody className={styles.redColor}>{t('table.noDataLoaded')}</TextBody>
    } else if (isEmptyRows) {
        return <TextBody>{t('table.noRowsFound')}</TextBody>
    } else {
        return <></>
    }
}

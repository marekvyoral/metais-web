import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@/components/actions-over-table/actionsOverTable.module.scss'

type SelectedRowsAriaReadProps = {
    count: number
}

export const SelectedRowsAriaRead = ({ count }: SelectedRowsAriaReadProps) => {
    const { t } = useTranslation()
    return (
        <span className={styles.visuallyHidden} aria-live="polite">
            {t('aria.selectedRowsCount', { count: count })}
        </span>
    )
}

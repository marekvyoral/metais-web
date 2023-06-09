import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './listActions.module.scss'

import { SimpleSelect } from '@portal/components/SimpleSelect'

interface IListActionsProps extends PropsWithChildren {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
}

const defaultPagingOptions = [
    { value: '100', label: '100' },
    { value: '100000', label: '1000000' },
]

export const ListActions: React.FC<IListActionsProps> = ({ children, pagingOptions }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.listActionsHeading}>
            <div className={styles.listActionsButton}>{children}</div>
            <SimpleSelect
                className={styles.selectGroup}
                label={t('listActions.selectView')}
                id={'1'}
                options={pagingOptions ?? defaultPagingOptions}
            />
        </div>
    )
}

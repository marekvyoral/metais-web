import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { SimpleSelect } from '@isdd/idsk-ui-kit'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

import styles from './listActions.module.scss'

interface IListActionsProps extends PropsWithChildren {
    pagingOptions?: { value: string; label: string; disabled?: boolean }[]
}

export const ListActions: React.FC<IListActionsProps> = ({ children, pagingOptions }) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={styles.listActionsHeading}>
                <div className={styles.listActionsButton}>{children}</div>
                <SimpleSelect
                    className={styles.selectGroup}
                    label={t('listActions.selectView')}
                    id="select-view"
                    name="select-view"
                    options={pagingOptions ?? DEFAULT_PAGESIZE_OPTIONS}
                    isClearable={false}
                />
            </div>
        </>
    )
}

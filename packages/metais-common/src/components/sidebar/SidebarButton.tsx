import React, { SetStateAction } from 'react'
import classNames from 'classnames'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import styles from '@/components/GridView.module.scss'

interface Props {
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const SidebarButton = ({ isSidebarExpanded, setIsSidebarExpanded }: Props) => {
    const { t } = useTranslation()
    return (
        <button className={styles.closeSidebarButton} onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} aria-hidden tabIndex={-1}>
            <div className={styles.rotate}>{isSidebarExpanded ? t('sidebar.hide') : t('sidebar.unhide')}</div>
            <img src={ArrowDownIcon} alt="" className={classNames(!isSidebarExpanded ? styles.rotate : styles.rotateClockWise)} />
        </button>
    )
}

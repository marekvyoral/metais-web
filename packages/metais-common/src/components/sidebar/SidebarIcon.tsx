import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import styles from '@isdd/metais-common/components/GridView.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

interface Props {
    section: NavigationItem
    onToggle: (toggle?: boolean) => void
    setIsSidebarExpanded: (value: React.SetStateAction<boolean>) => void
    isExpanded: boolean
    buttonId: string
}

export const SidebarIcon = ({ section, onToggle, setIsSidebarExpanded, isExpanded, buttonId }: Props) => {
    return (
        <Link
            to={section.path}
            className={classNames(styles.sidebarlink, styles.smallSidebarDivider)}
            onClick={() => {
                onToggle(true)
                setIsSidebarExpanded(true)
            }}
        >
            <img src={section.icon} className={styles.img} />
            <span
                className={classNames(styles.sectionHeaderButton, styles.smallSidebarText, isExpanded && styles.expanded)}
                aria-expanded={isExpanded}
                id={buttonId}
            >
                {section.title}
            </span>
        </Link>
    )
}
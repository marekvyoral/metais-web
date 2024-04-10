import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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

export const SidebarIcon = ({ section, onToggle, setIsSidebarExpanded, isExpanded }: Props) => {
    const location = useLocation()
    return (
        <Link
            state={{ from: location }}
            to={section.path}
            className={classNames(styles.sidebarlink, styles.smallSidebarDivider)}
            onClick={() => {
                onToggle(true)
                setIsSidebarExpanded(true)
            }}
            aria-haspopup={section.subItems ? 'menu' : undefined}
        >
            <img src={section.icon} className={styles.img} alt="" />
            <span
                className={classNames(styles.sectionHeaderButton, styles.smallSidebarText, isExpanded && styles.expanded)}
                aria-expanded={section.subItems ? isExpanded : undefined}
            >
                {section.title}
            </span>
        </Link>
    )
}

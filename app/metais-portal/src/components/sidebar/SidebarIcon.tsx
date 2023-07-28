import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { AccordionSection } from './Sidebar'

import styles from '@/components/GridView.module.scss'

interface Props {
    section: AccordionSection
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

import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/index'

import { SidebarItems } from './SidebarItems'

import styles from '@isdd/metais-common/components/GridView.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

interface Props {
    section: NavigationItem
    onToggle: (toggle?: boolean) => void
    isExpanded: boolean
    buttonId: string
    activeTab: string | undefined
}

export const SidebarContentHolder = ({ section, onToggle, isExpanded, buttonId, activeTab }: Props) => {
    const location = useLocation()
    return (
        <>
            <div className={classNames(styles.sectionHeader, styles.hover)} onClick={() => onToggle()}>
                <Link
                    state={{ from: location }}
                    className={classNames(
                        styles.sidebarlink,
                        styles.sectionHeaderButton,
                        ((section.subItems && isExpanded) || activeTab === section.path) && styles.expanded,
                    )}
                    aria-expanded={isExpanded}
                    id={buttonId}
                    to={section.path}
                >
                    {section.title}
                </Link>
                {section.subItems && <img src={ArrowDownIcon} className={classNames(styles.arrow, !isExpanded && styles.rotate)} alt="arrow-down" />}
            </div>
            <div className={classNames(styles.hide, isExpanded && styles.unhide)} aria-labelledby={buttonId}>
                <div className="govuk-body" style={{ marginBottom: '0px' }}>
                    {<SidebarItems list={section.subItems} />}
                </div>
            </div>
        </>
    )
}

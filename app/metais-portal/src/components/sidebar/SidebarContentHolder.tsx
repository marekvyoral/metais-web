import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { AccordionSection } from './Sidebar'

import styles from '@/components/GridView.module.scss'

interface Props {
    section: AccordionSection
    onToggle: (toggle?: boolean) => void
    isExpanded: boolean
    buttonId: string
    activeTab: RouteNames | undefined
}

export const SidebarContentHolder = ({ section, onToggle, isExpanded, buttonId, activeTab }: Props) => {
    return (
        <>
            <h2 className={classNames(styles.sectionHeader, styles.hover)} onClick={() => onToggle()}>
                <Link
                    className={classNames(
                        styles.sidebarlink,
                        styles.sectionHeaderButton,
                        (isExpanded || activeTab === section.path) && styles.expanded,
                    )}
                    aria-expanded={isExpanded}
                    id={buttonId}
                    to={section.path}
                >
                    {section.title}
                </Link>
                {section.content && <img src={ArrowDownIcon} className={classNames(styles.arrow, !isExpanded && styles.rotate)} alt="arrow-down" />}
            </h2>
            <div className={classNames(styles.hide, isExpanded && styles.unhide)} aria-labelledby={buttonId}>
                <div className="govuk-body">{section.content}</div>
            </div>
        </>
    )
}

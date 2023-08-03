import React, { SetStateAction, useState } from 'react'
import classNames from 'classnames'

import { SidebarSection } from './SidebarSection'

import { useCurrentTab } from '@isdd/metais-common/hooks/useCurrentTab'
import styles from '@isdd/metais-common/components/GridView.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

interface Props {
    sections: NavigationItem[]
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const SidebarSectionsContainer = ({ isSidebarExpanded, setIsSidebarExpanded, sections }: Props) => {
    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(() => Array(sections.length).fill(false))

    const [activeTab, setActiveTab] = useState<string | undefined>()

    useCurrentTab(
        sections.map((section) => section.path),
        setActiveTab,
    )

    return (
        <div className={classNames('govuk-!-font-size-19', styles.sectionsContainer, !isSidebarExpanded && styles.closesSectionsContainer)}>
            {sections.map((section, index) => (
                <div key={index} className={styles.govukBottomMargin}>
                    <SidebarSection
                        expandedSectionIndexes={expandedSectionIndexes}
                        index={index}
                        setExpandedSectionIndexes={setExpandedSectionIndexes}
                        isSidebarExpanded={isSidebarExpanded}
                        section={section}
                        setIsSidebarExpanded={setIsSidebarExpanded}
                        activeTab={activeTab}
                    />
                </div>
            ))}
        </div>
    )
}

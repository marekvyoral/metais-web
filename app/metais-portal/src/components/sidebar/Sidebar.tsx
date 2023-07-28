import React, { SetStateAction, useState } from 'react'
import classNames from 'classnames'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useCurrentTab } from '@isdd/metais-common/hooks/useCurrentTab'

import { SidebarSection } from './SidebarSection'

import styles from '@/components/GridView.module.scss'
import { navItems } from '@/components/navbar/navmenu/NavMenu'

export type AccordionSection = {
    title: string
    content?: React.ReactNode
    path: string
    icon: string
}

interface Props {
    sections: AccordionSection[]
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const Sidebar = ({ isSidebarExpanded, setIsSidebarExpanded, sections }: Props) => {
    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(() => Array(sections.length).fill(false))

    const [activeTab, setActiveTab] = useState<RouteNames | undefined>()

    useCurrentTab(navItems, setActiveTab)

    return (
        <div className={classNames(styles.sectionsContainer, !isSidebarExpanded && styles.closesSectionsContainer)}>
            {sections.map((section, index) => (
                <div key={index}>
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

import React, { useId } from 'react'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { AccordionSection } from './Sidebar'
import { SidebarContentHolder } from './SidebarContentHolder'
import { SidebarIcon } from './SidebarIcon'

interface Props {
    expandedSectionIndexes: boolean[]
    index: number
    setExpandedSectionIndexes: React.Dispatch<React.SetStateAction<boolean[]>>
    isSidebarExpanded: boolean
    section: AccordionSection
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>
    activeTab: RouteNames | undefined
}

export const SidebarSection = ({
    expandedSectionIndexes,
    index,
    setExpandedSectionIndexes,
    isSidebarExpanded,
    section,
    setIsSidebarExpanded,
    activeTab,
}: Props) => {
    const id = useId()

    const isExpanded = expandedSectionIndexes[index]
    const onToggle = (toggle?: boolean) => {
        setExpandedSectionIndexes((prev) => {
            const newArr = [...prev]
            if (toggle) newArr[index] = toggle
            else newArr[index] = !isExpanded
            return newArr
        })
    }
    const buttonId = `${id}-heading-${index + 1}`
    return (
        <>
            {isSidebarExpanded ? (
                <SidebarContentHolder section={section} onToggle={onToggle} isExpanded={isExpanded} buttonId={buttonId} activeTab={activeTab} />
            ) : (
                <SidebarIcon
                    section={section}
                    onToggle={onToggle}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    isExpanded={isExpanded}
                    buttonId={buttonId}
                />
            )}
        </>
    )
}

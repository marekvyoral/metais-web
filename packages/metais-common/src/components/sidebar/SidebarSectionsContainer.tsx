import React, { SetStateAction, useState } from 'react'
import classNames from 'classnames'

import { SidebarIcon } from './SidebarIcon'
import { SidebarItem } from './SidebarItem'

import styles from '@isdd/metais-common/components/GridView.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

interface Props {
    sections: NavigationItem[]
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const SidebarSectionsContainer = ({ isSidebarExpanded, setIsSidebarExpanded, sections }: Props) => {
    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(() => Array(sections.length).fill(false))

    return (
        <div
            className={classNames('govuk-!-font-size-19', styles.sectionsContainer, !isSidebarExpanded && styles.closesSectionsContainer)}
            aria-hidden
        >
            {sections.map((menuItem, index) => {
                const isExpanded = expandedSectionIndexes[index]
                const onToggle = (toggle?: boolean) => {
                    setExpandedSectionIndexes((prev) => {
                        const newArr = [...prev]
                        if (toggle) newArr[index] = toggle
                        else newArr[index] = !isExpanded
                        return newArr
                    })
                }

                return (
                    <div key={index} className={styles.govukBottomMargin}>
                        {isSidebarExpanded ? (
                            <SidebarItem
                                key={`menuItem-${index}.${menuItem.title}`}
                                item={menuItem}
                                isSidebarExpanded={isSidebarExpanded}
                                onToggle={onToggle}
                                isExpanded={isExpanded}
                            />
                        ) : (
                            <SidebarIcon
                                section={menuItem}
                                onToggle={onToggle}
                                setIsSidebarExpanded={setIsSidebarExpanded}
                                isExpanded={isExpanded}
                                buttonId={'buttonId' + index}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import { SidebarIcon } from './SidebarIcon'
import { NavigationItem, SidebarItem } from './SidebarItem'

import styles from '@isdd/metais-common/components/GridView.module.scss'
import { findDefaultOpenedNavItems } from '@isdd/metais-common/componentHelpers/sideMenu'

interface Props {
    sections: NavigationItem[]
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const SidebarSectionsContainer = ({ isSidebarExpanded, setIsSidebarExpanded, sections }: Props) => {
    const [expandedSectionIndexes, setExpandedSectionIndexes] = useState<boolean[]>(() => Array(sections.length).fill(false))

    const location = useLocation()

    const defaultOpenedMenuItems = useMemo(() => {
        const locationPOException = location.pathname.replace('/PO/', '/PO_IS/')

        return findDefaultOpenedNavItems(sections, locationPOException)
    }, [location.pathname, sections])

    useEffect(() => {
        if (defaultOpenedMenuItems != null) {
            setExpandedSectionIndexes((prev) => [
                ...prev.slice(0, defaultOpenedMenuItems[0].index),
                true,
                ...prev.slice(defaultOpenedMenuItems[0].index + 1),
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classNames('govuk-!-font-size-19', styles.sectionsContainer, !isSidebarExpanded && styles.closesSectionsContainer)}>
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
                                defaultOpenedMenuItemsIndexes={
                                    defaultOpenedMenuItems ? defaultOpenedMenuItems.map((item) => item.index).slice(1) : []
                                }
                                defaultOpenedMenuItemsPaths={defaultOpenedMenuItems?.map((item) => item.path) ?? []}
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

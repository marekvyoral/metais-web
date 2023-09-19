import { ArrowDownIcon } from '@isdd/idsk-ui-kit'
import classNames from 'classnames'
import React, { useState } from 'react'
import { Link, useMatch } from 'react-router-dom'

import styles from '@/components/GridView.module.scss'

export interface NavigationItem {
    title: string
    path: string
    subItems?: NavigationItem[]
    icon?: string
}

export interface SidebarItemProps {
    item: NavigationItem
    onToggle: (toggle?: boolean) => void
    isExpanded: boolean
    isSidebarExpanded: boolean
}

export const SidebarItem = ({ item, isSidebarExpanded, onToggle, isExpanded }: SidebarItemProps) => {
    const [expandedSubItemIndexes, setExpandedSubItemIndexes] = useState<boolean[]>(() => Array(item.subItems?.length).fill(false))
    const urlMatched = useMatch(item.path)

    return (
        <>
            <div className={styles.govukBottomMargin}>
                <div className={classNames(styles.sectionHeader, styles.hover)} onClick={() => onToggle(!isExpanded)}>
                    <Link
                        className={classNames(
                            styles.sidebarlink,
                            styles.sectionHeaderButton,
                            ((item.subItems?.length && isExpanded) || urlMatched) && styles.expanded,
                        )}
                        aria-expanded={isExpanded}
                        to={item.path}
                        id={item.title}
                    >
                        {item.title}
                    </Link>
                    {item.subItems && isSidebarExpanded && (
                        <img src={ArrowDownIcon} className={classNames(styles.arrow, !isExpanded && styles.rotate)} alt="arrow-down" />
                    )}
                </div>
                {item.subItems && isExpanded && isSidebarExpanded && (
                    <div className={classNames(styles.hide, isExpanded && styles.unhide)} aria-labelledby={item.title}>
                        <div className={styles.safeMargin}>
                            {item.subItems.map((subItem, indexSubItem) => {
                                const isExpandedSub = expandedSubItemIndexes[indexSubItem]
                                const onToggleSub = (toggle?: boolean) => {
                                    setExpandedSubItemIndexes((prev) => {
                                        const newArr = [...prev]
                                        if (toggle) newArr[indexSubItem] = toggle
                                        else newArr[indexSubItem] = !isExpandedSub
                                        return newArr
                                    })
                                }
                                return (
                                    <SidebarItem
                                        key={`subItem-${indexSubItem}.${subItem.title}`}
                                        item={subItem}
                                        isSidebarExpanded={isSidebarExpanded}
                                        isExpanded={isExpandedSub}
                                        onToggle={onToggleSub}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

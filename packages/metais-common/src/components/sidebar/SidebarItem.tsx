import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ArrowDownIcon } from '@isdd/idsk-ui-kit'

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
    activeTab?: string
    isSidebarExpanded: boolean
}

export const SidebarItem = ({ item, activeTab, isSidebarExpanded, onToggle, isExpanded }: SidebarItemProps) => {
    return (
        <>
            <div className={styles.govukBottomMargin}>
                <div className={classNames(styles.sectionHeader, styles.hover)} onClick={() => onToggle(!isExpanded)}>
                    <Link
                        className={classNames(
                            styles.sidebarlink,
                            styles.sectionHeaderButton,
                            ((item.subItems && isExpanded) || activeTab === item.path) && styles.expanded,
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
                                return (
                                    <SidebarItem
                                        key={`subItem-${indexSubItem}.${subItem.title}`}
                                        item={subItem}
                                        activeTab={activeTab}
                                        isSidebarExpanded={isSidebarExpanded}
                                        isExpanded={false}
                                        onToggle={() => {
                                            return
                                        }}
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

import { ArrowDownIcon } from '@isdd/idsk-ui-kit'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from '@isdd/metais-common/components/GridView.module.scss'

export interface NavigationItem {
    title: string
    path: string
    subItems?: NavigationItem[]
    icon?: string
    target?: string
}

export interface SidebarItemProps {
    item: NavigationItem
    onToggle: (toggle?: boolean) => void
    isExpanded: boolean
    isSidebarExpanded: boolean
    defaultOpenedMenuItemsIndexes: number[]
    defaultOpenedMenuItemsPaths: string[]
    hasSamePathAsParent?: boolean
}

export const SidebarItem = ({
    item,
    isSidebarExpanded,
    onToggle,
    isExpanded,
    defaultOpenedMenuItemsIndexes,
    defaultOpenedMenuItemsPaths,
    hasSamePathAsParent,
}: SidebarItemProps) => {
    const [expandedSubItemIndexes, setExpandedSubItemIndexes] = useState<boolean[]>(() => Array(item.subItems?.length).fill(false))

    const isDefaultOpened = defaultOpenedMenuItemsPaths.some((opened) => opened === item.path)
    const isUrlMatched = !!useMatch(item.path)

    const location = useLocation()
    const locationWithoutItemPath = location.pathname.slice(item.path.length)
    const isDetail = hasSamePathAsParent
        ? locationWithoutItemPath.includes('detail') || locationWithoutItemPath.includes('create') || locationWithoutItemPath.includes('edit')
        : false

    const shouldNotBeBold = hasSamePathAsParent && !isDetail && !isUrlMatched

    const { t } = useTranslation()

    useEffect(() => {
        if (defaultOpenedMenuItemsIndexes.length > 0) {
            setExpandedSubItemIndexes((prev) => [
                ...prev.slice(0, defaultOpenedMenuItemsIndexes[0]),
                true,
                ...prev.slice(defaultOpenedMenuItemsIndexes[0] + 1),
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className={styles.govukBottomMargin}>
                <div className={classNames(styles.sectionHeader, styles.hover)} onClick={() => onToggle(!isExpanded)}>
                    <Link
                        className={classNames(
                            styles.sidebarlink,
                            styles.sectionHeaderButton,
                            ((item.subItems?.length && isExpanded) || isDefaultOpened || isUrlMatched) && !shouldNotBeBold && styles.expanded,
                        )}
                        aria-expanded={isExpanded}
                        to={item.path}
                        {...(item.target && { target: item.target })}
                    >
                        {item.title}
                    </Link>
                    {item.subItems && isSidebarExpanded && (
                        <img src={ArrowDownIcon} className={classNames(styles.arrow, !isExpanded && styles.rotate)} alt="" />
                    )}
                </div>
                {item.subItems && isExpanded && isSidebarExpanded && (
                    <div
                        className={classNames(styles.hide, isExpanded && styles.unhide)}
                        aria-label={t('sidebar.groupLabel', { title: item.title })}
                        role="group"
                    >
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
                                const subItemHasSamePathAsParent = item.path == subItem.path

                                return (
                                    <SidebarItem
                                        key={`subItem-${indexSubItem}.${subItem.title}`}
                                        item={subItem}
                                        isSidebarExpanded={isSidebarExpanded}
                                        isExpanded={isExpandedSub}
                                        onToggle={onToggleSub}
                                        defaultOpenedMenuItemsIndexes={defaultOpenedMenuItemsIndexes.slice(1)}
                                        defaultOpenedMenuItemsPaths={defaultOpenedMenuItemsPaths}
                                        hasSamePathAsParent={subItemHasSamePathAsParent}
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

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useCurrentTab } from '@isdd/metais-common/hooks/useCurrentTab'

import styles from '@/components/GridView.module.scss'

interface Props {
    list: { title: string; path: string }[]
}

export const SidebarItems = ({ list }: Props) => {
    const [activeTab, setActiveTab] = useState<NavigationSubRoutes | undefined>()
    const navItems = Object.values(NavigationSubRoutes)

    useCurrentTab(navItems, setActiveTab)

    return (
        <div className={styles.safeMargin}>
            {list.map((item) => (
                <div key={item.title} className={classNames('govuk-grid-row', styles.sidebarRow)}>
                    <Link className={classNames(styles.sidebarlink, activeTab === item.path && styles.expanded)} to={item.path} title={item.title}>
                        <span>{item.title}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
}

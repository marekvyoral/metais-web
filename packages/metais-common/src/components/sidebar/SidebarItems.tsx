import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { useCurrentTab } from '@isdd/metais-common/hooks/useCurrentTab'
import styles from '@/components/GridView.module.scss'

interface Props {
    list: { title: string; path: string }[] | undefined
}

export const SidebarItems = ({ list }: Props) => {
    const [activeTab, setActiveTab] = useState<string | undefined>()
    const location = useLocation()
    useCurrentTab(list?.map((item) => item.path) || [], setActiveTab)
    return (
        <div className={styles.safeMargin}>
            {list?.map((item) => (
                <div key={item.title} className={classNames('govuk-grid-row', styles.govukBottomTop)}>
                    <Link
                        className={classNames(styles.sidebarlink, activeTab === item.path && styles.expanded)}
                        state={{ from: location }}
                        to={item.path}
                        title={item.title}
                    >
                        <span>{item.title}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
}

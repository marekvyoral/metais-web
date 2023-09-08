import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import styles from '@/components/GridView.module.scss'

interface Props {
    list: { title: string; path: string }[] | undefined
}

export const SidebarItems = ({ list }: Props) => {
    const location = useLocation()
    return (
        <div className={styles.safeMargin}>
            {list?.map((item) => (
                <div key={item.title} className={classNames('govuk-grid-row', styles.govukBottomTop)}>
                    <Link
                        className={classNames(styles.sidebarlink, location.pathname === item.path && styles.expanded)}
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

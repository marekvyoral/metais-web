import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'

interface IIconWithNotification {
    onClick?: () => void
    count: number
    src: string
    title: string
    path: string
    showAsLink: boolean
    altText: string
}

export const IconWithNotification: React.FC<IIconWithNotification> = ({ onClick, count, src, title, path, showAsLink, altText }) => {
    const location = useLocation()
    return showAsLink ? (
        <Link to={path} title={title} state={{ from: location }} onClick={onClick}>
            <span className="govuk-visually-hidden">{title}</span>
            <img src={src} style={{ opacity: count ? 1 : 0.5 }} alt={altText} />
            {count > 0 && <div className={styles.notificationIcon}>{count}</div>}
        </Link>
    ) : (
        <div onClick={onClick}>
            <span className="govuk-visually-hidden">{title}</span>
            <img src={src} style={{ opacity: count ? 1 : 0.5 }} alt={altText} />
            {count > 0 && <div className={styles.notificationIcon}>{count}</div>}
        </div>
    )
}

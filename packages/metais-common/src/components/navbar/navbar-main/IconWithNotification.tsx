import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'

interface IIconWithNotification {
    onClick?: () => void
    count: number
    iconActive: string
    iconInactive: string
    title: string
    path: string
    showAsLink: boolean
    altText: string
}

export const IconWithNotification: React.FC<IIconWithNotification> = ({
    onClick,
    count,
    iconActive,
    iconInactive,
    title,
    path,
    showAsLink,
    altText,
}) => {
    const location = useLocation()
    return showAsLink ? (
        <Link to={path} title={title} state={{ from: location }} onClick={onClick}>
            <span className="govuk-visually-hidden">{title}</span>
            <img src={count > 0 ? iconActive : iconInactive} alt={altText} />
            {count > 0 && <div className={styles.notificationIcon}>{count}</div>}
        </Link>
    ) : (
        <div onClick={onClick}>
            <span className="govuk-visually-hidden">{title}</span>
            <img src={count > 0 ? iconActive : iconInactive} alt={altText} />
            {count > 0 && <div className={styles.notificationIcon}>{count}</div>}
        </div>
    )
}

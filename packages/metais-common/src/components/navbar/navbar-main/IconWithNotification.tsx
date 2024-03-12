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
    ariaLabel: string
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
    ariaLabel,
}) => {
    const location = useLocation()
    return showAsLink ? (
        <Link to={path} title={title} state={{ from: location }} onClick={onClick}>
            <img src={count > 0 ? iconActive : iconInactive} alt="" />
            {count > 0 && (
                <>
                    <div aria-hidden className={styles.notificationIcon}>
                        {count}
                    </div>
                    <span className="govuk-visually-hidden">
                        {title} {ariaLabel}
                    </span>
                </>
            )}
        </Link>
    ) : (
        <div onClick={onClick} role="button">
            <span className="govuk-visually-hidden" aria-label={altText}>
                {title}
            </span>
            <img src={count > 0 ? iconActive : iconInactive} alt="" />
            {count > 0 && (
                <>
                    <div className={styles.notificationIcon} aria-hidden>
                        {count}
                    </div>
                    <span className="govuk-visually-hidden">{ariaLabel}</span>
                </>
            )}
        </div>
    )
}

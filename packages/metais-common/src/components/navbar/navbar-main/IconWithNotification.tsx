import React, { forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@isdd/idsk-ui-kit'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'

interface IIconWithNotification {
    id?: string
    onClick?: () => void
    count: number
    iconActive: string
    iconInactive: string
    title: string
    path: string
    showAsLink: boolean
    altText: string
    ariaLabel: string
    className?: string
}

export const IconWithNotification: React.FC<IIconWithNotification> = forwardRef<HTMLAnchorElement & HTMLButtonElement, IIconWithNotification>(
    ({ id, onClick, count, iconActive, iconInactive, title, path, showAsLink, altText, ariaLabel, className }, ref) => {
        const location = useLocation()
        return showAsLink ? (
            <Link ref={ref} to={path} title={title} state={{ from: location }} onClick={onClick} className={className} id={id}>
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
            <Button
                ref={ref}
                onClick={onClick}
                className={className}
                id={id}
                label={
                    <>
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
                    </>
                }
            />
        )
    },
)

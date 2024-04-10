import React, { AriaAttributes, forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@isdd/idsk-ui-kit'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'

interface IIconWithNotification {
    id?: string
    onClick?: () => void
    count: number
    iconActive: string
    iconInactive: string
    path: string
    showAsLink: boolean
    aria?: AriaAttributes
    className?: string
}

export const IconWithNotification: React.FC<IIconWithNotification> = forwardRef<HTMLAnchorElement & HTMLButtonElement, IIconWithNotification>(
    ({ id, onClick, count, iconActive, iconInactive, path, showAsLink, className, aria }, ref) => {
        const location = useLocation()
        return showAsLink ? (
            <Link ref={ref} to={path} state={{ from: location }} onClick={onClick} className={className} id={id} {...aria}>
                <img src={count > 0 ? iconActive : iconInactive} alt="" />
                {count > 0 && <div className={styles.notificationIcon}>{count}</div>}
            </Link>
        ) : (
            <Button
                ref={ref}
                onClick={onClick}
                className={className}
                id={id}
                label={
                    <>
                        <img src={count > 0 ? iconActive : iconInactive} alt="" />
                        {count > 0 && (
                            <>
                                <div className={styles.notificationIcon}>{count}</div>
                            </>
                        )}
                    </>
                }
                {...aria}
            />
        )
    },
)

import classNames from 'classnames'
import React, { MouseEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './button-link.module.scss'

interface ButtonLinkProps {
    label?: string | React.ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    className?: string
    type?: 'submit' | 'reset' | 'button'
    icon?: string
    disabled?: boolean
    withoutFocus?: boolean
    hidden?: boolean
    onMouseOver?: React.MouseEventHandler<HTMLButtonElement>
    onMouseOut?: React.MouseEventHandler<HTMLButtonElement>
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
    onClick,
    label,
    className,
    icon,
    type,
    disabled,
    withoutFocus,
    onMouseOver,
    onMouseOut,
    hidden = false,
}) => {
    const { t } = useTranslation()
    const ref = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (withoutFocus) ref.current?.blur()
    }, [withoutFocus])

    return (
        <>
            {!hidden && (
                <button
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    className={classNames(styles.buttonLink, className, !!disabled && styles.disabled)}
                    onClick={(e) => (onClick ? onClick(e) : null)}
                    type={type}
                    disabled={disabled}
                    ref={ref}
                >
                    {icon && <img className={styles.iconInButtonLink} src={icon} alt="" />}
                    {label ?? t('errors.fixLink')}
                </button>
            )}
        </>
    )
}

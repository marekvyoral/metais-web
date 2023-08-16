import classNames from 'classnames'
import React, { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './button-link.module.scss'

interface ButtonLinkProps {
    label?: string | React.ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    className?: string
    type?: 'submit' | 'reset' | 'button'
    icon?: string
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ onClick, label, className, icon, type }) => {
    const { t } = useTranslation()
    return (
        <button className={classNames(styles.buttonLink, className)} onClick={(e) => (onClick ? onClick(e) : null)} type={type}>
            {icon && <img className={styles.iconInButtonLink} src={icon} />}
            {label ?? t('errors.fixLink')}
        </button>
    )
}

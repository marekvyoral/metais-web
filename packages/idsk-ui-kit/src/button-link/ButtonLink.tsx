import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './button-link.module.scss'

interface ButtonLinkProps {
    label?: string
    onClick?: () => void
    className?: string
    icon?: React.ReactNode
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ onClick, label, className, icon }) => {
    const { t } = useTranslation()
    return (
        <button className={classNames(styles.buttonLink, className)} onClick={onClick}>
            {icon}
            {label ?? t('errors.fixLink')}
        </button>
    )
}

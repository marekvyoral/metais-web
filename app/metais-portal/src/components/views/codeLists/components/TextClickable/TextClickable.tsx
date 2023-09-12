import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

import style from './textClickable.module.scss'

interface TextClickableProps extends PropsWithChildren {
    onClick: () => void
    inverse?: boolean
    noUnderline?: boolean
    className?: string
}

export const TextClickable: React.FC<TextClickableProps> = ({ children, onClick, inverse, noUnderline, className }) => {
    return (
        <button
            onClick={onClick}
            className={classNames(
                'govuk-link',
                style.textLink,
                { 'govuk-link--inverse': !!inverse },
                { 'govuk-link--no-underline': !!noUnderline },
                className,
            )}
        >
            {children}
        </button>
    )
}

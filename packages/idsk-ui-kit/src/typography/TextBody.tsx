import classNames from 'classnames'
import React, { AriaAttributes, PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'

interface ITextBodyProps extends PropsWithChildren {
    id?: string
    size?: 'S' | 'L'
    className?: string
    lang?: string | undefined
    aria?: AriaAttributes
}

export const TextBody = forwardRef<HTMLParagraphElement, ITextBodyProps>(({ id, children, size, className, lang, aria }, ref) => {
    return (
        <p
            id={id}
            lang={lang}
            ref={ref}
            className={classNames(
                {
                    'govuk-body': !size,
                    'govuk-body-s': size === 'S',
                    'govuk-body-l': size === 'L',
                },
                styles.lineMaxWidth,
                className,
            )}
            {...aria}
        >
            {children}
        </p>
    )
})

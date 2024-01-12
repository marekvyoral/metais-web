import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'

interface ITextBodyProps extends PropsWithChildren {
    size?: 'S' | 'L'
    className?: string
    lang?: string | undefined
}

export const TextBody = forwardRef<HTMLParagraphElement, ITextBodyProps>(({ children, size, className, lang }, ref) => {
    return (
        <>
            {!size && (
                <p lang={lang} ref={ref} className={classNames('govuk-body', styles.lineMaxWidth, className)}>
                    {children}
                </p>
            )}
            {size === 'S' && (
                <p lang={lang} ref={ref} className={classNames('govuk-body-s', styles.lineMaxWidth, className)}>
                    {children}
                </p>
            )}
            {size === 'L' && (
                <p lang={lang} ref={ref} className={classNames('govuk-body-l', styles.lineMaxWidth, className)}>
                    {children}
                </p>
            )}
        </>
    )
})

import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextBodyProps extends PropsWithChildren {
    size?: 'S' | 'L'
    className?: string
    lang?: string | undefined
}

export const TextBody = forwardRef<HTMLParagraphElement, ITextBodyProps>(({ children, size, className, lang }, ref) => {
    return (
        <>
            {!size && (
                <p lang={lang} ref={ref} className={classNames('govuk-body', className)}>
                    {children}
                </p>
            )}
            {size === 'S' && (
                <p lang={lang} ref={ref} className={classNames('govuk-body-s', className)}>
                    {children}
                </p>
            )}
            {size === 'L' && (
                <p lang={lang} ref={ref} className={classNames('govuk-body-l', className)}>
                    {children}
                </p>
            )}
        </>
    )
})

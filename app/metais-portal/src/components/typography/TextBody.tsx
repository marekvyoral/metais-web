import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextBodyProps extends PropsWithChildren {
    size?: 'S' | 'L'
    className?: string
}

export const TextBody = forwardRef<HTMLParagraphElement, ITextBodyProps>(({ children, size, className }, ref) => {
    return (
        <>
            {!size && (
                <p ref={ref} className={classNames('govuk-body', className)}>
                    {children}
                </p>
            )}
            {size === 'S' && (
                <p ref={ref} className={classNames('govuk-body-s', className)}>
                    {children}
                </p>
            )}
            {size === 'L' && (
                <p ref={ref} className={classNames('govuk-body-l', className)}>
                    {children}
                </p>
            )}
        </>
    )
})

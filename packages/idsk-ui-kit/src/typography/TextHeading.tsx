import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextHeadingProps extends PropsWithChildren {
    size: 'S' | 'M' | 'L' | 'XL'
    className?: string
}
export const TextHeading = forwardRef<HTMLHeadingElement, ITextHeadingProps>(({ children, size, className }, ref) => {
    return (
        <>
            {size === 'XL' && (
                <h1 ref={ref} className={classNames('govuk-heading-xl', className)}>
                    {children}
                </h1>
            )}
            {size === 'L' && (
                <h2 ref={ref} className={classNames('govuk-heading-l', className)}>
                    {children}
                </h2>
            )}
            {size === 'M' && (
                <h3 ref={ref} className={classNames('govuk-heading-m', className)}>
                    {children}
                </h3>
            )}
            {size === 'S' && (
                <h4 ref={ref} className={classNames('govuk-heading-s', className)}>
                    {children}
                </h4>
            )}
        </>
    )
})

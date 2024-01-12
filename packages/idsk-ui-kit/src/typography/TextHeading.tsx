import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'

import styles from './styles.module.scss'
interface ITextHeadingProps extends PropsWithChildren {
    size: 'S' | 'M' | 'L' | 'XL'
    className?: string
}
export const TextHeading = forwardRef<HTMLHeadingElement, ITextHeadingProps>(({ children, size, className }, ref) => {
    return (
        <>
            {size === 'XL' && (
                <h1 ref={ref} className={classNames('govuk-heading-xl', styles.lineMaxWidth, className)}>
                    {children}
                </h1>
            )}
            {size === 'L' && (
                <h2 ref={ref} className={classNames('govuk-heading-l', styles.lineMaxWidth, className)}>
                    {children}
                </h2>
            )}
            {size === 'M' && (
                <h3 ref={ref} className={classNames('govuk-heading-m', styles.lineMaxWidth, className)}>
                    {children}
                </h3>
            )}
            {size === 'S' && (
                <h4 ref={ref} className={classNames('govuk-heading-s', styles.lineMaxWidth, className)}>
                    {children}
                </h4>
            )}
        </>
    )
})

import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface ITextLinkProps extends PropsWithChildren {
    linkBack?: boolean
    noVisitedState?: boolean
    inverse?: boolean
    noUnderline?: boolean
    to: string
    className?: string
    newTab?: boolean
    textBodySize?: boolean
}

export const TextLink = forwardRef<HTMLAnchorElement, ITextLinkProps>(
    ({ children, className, linkBack, noVisitedState, inverse, noUnderline, to, newTab, textBodySize }, ref) => {
        const location = useLocation()
        return (
            <Link
                state={{ from: location }}
                ref={ref}
                className={classNames(
                    { 'govuk-body': !!textBodySize },
                    'govuk-link',
                    { 'govuk-link--no-visited-state': !!noVisitedState },
                    { 'govuk-link--inverse': !!inverse },
                    { 'govuk-link--no-underline': !!noUnderline },
                    { 'link-back': !!linkBack },
                    className,
                )}
                target={newTab ? '_blank' : '_self'}
                to={to}
            >
                {children}
            </Link>
        )
    },
)

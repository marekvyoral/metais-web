import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'
import { Link } from 'react-router-dom'

interface ITextLinkProps extends PropsWithChildren {
    linkBack?: boolean
    noVisitedState?: boolean
    inverse?: boolean
    noUnderline?: boolean
    to: string
    className?: string
}

export const TextLink = forwardRef<HTMLAnchorElement, ITextLinkProps>(
    ({ children, className, linkBack, noVisitedState, inverse, noUnderline, to }, ref) => {
        return (
            <Link
                ref={ref}
                className={classNames(
                    'govuk-link',
                    { 'govuk-link--no-visited-state': !!noVisitedState },
                    { 'govuk-link--inverse': !!inverse },
                    { 'govuk-link--no-underline': !!noUnderline },
                    { 'link-back': !!linkBack },
                    className,
                )}
                to={to}
            >
                {children}
            </Link>
        )
    },
)
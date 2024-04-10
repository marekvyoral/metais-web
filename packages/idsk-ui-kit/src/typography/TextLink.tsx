import classNames from 'classnames'
import React, { AriaAttributes, PropsWithChildren, forwardRef } from 'react'
import { Link, To, useLocation } from 'react-router-dom'

interface ITextLinkProps extends PropsWithChildren {
    id?: string
    linkBack?: boolean
    noVisitedState?: boolean
    inverse?: boolean
    noUnderline?: boolean
    to: To
    className?: string
    newTab?: boolean
    textBodySize?: boolean
    aria?: AriaAttributes
}

export const TextLink = forwardRef<HTMLAnchorElement, ITextLinkProps>(
    ({ id, children, className, linkBack, noVisitedState, inverse, noUnderline, to, newTab, textBodySize, aria }, ref) => {
        const location = useLocation()
        return (
            <Link
                id={id}
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
                {...aria}
            >
                {children}
            </Link>
        )
    },
)

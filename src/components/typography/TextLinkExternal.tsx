import classNames from 'classnames'
import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'

interface ITextLinkProps extends React.PropsWithChildren {
    linkBack?: boolean
    noVisitedState?: boolean
    inverse?: boolean
    noUnderline?: boolean
    to: string
}

export const TextLinkExternal = forwardRef<HTMLBodyElement, ITextLinkProps>(({ children, linkBack, noVisitedState, inverse, noUnderline, to }) => {
    return (
        <Link
            className={classNames(
                'govuk-link',
                { 'govuk-link--no-visited-state': !!noVisitedState },
                { 'govuk-link--inverse': !!inverse },
                { 'govuk-link--no-underline': !!noUnderline },
                { 'link-back': !!linkBack },
            )}
            to={to}
        >
            {children}
        </Link>
    )
})

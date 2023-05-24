import classNames from 'classnames'
import React, { forwardRef } from 'react'

interface ITextLinkProps extends React.PropsWithChildren {
    title: string
    href: string
    textLink?: string
    linkBack?: boolean
    noVisitedState?: boolean
    rel?: string
    target?: string
    inverse?: boolean
    noUnderline?: boolean
}

export const TextLink = forwardRef<HTMLBodyElement, ITextLinkProps>(
    ({ children, title, href, textLink, linkBack, noVisitedState, rel, target, inverse, noUnderline }) => {
        return (
            <>
                <p>
                    <a
                        className={classNames(
                            'govuk-link',
                            { 'govuk-link--no-visited-state': !!noVisitedState },
                            { 'govuk-link--inverse': !!inverse },
                            { 'govuk-link--no-underline': !!noUnderline },
                            { 'link-back': !!linkBack },
                        )}
                        href={href}
                        title={title}
                        rel={rel}
                        target={target}
                    >
                        {textLink}
                    </a>
                    {children}
                </p>
            </>
        )
    },
)

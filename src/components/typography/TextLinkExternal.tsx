import classNames from 'classnames'
import React, { forwardRef } from 'react'

interface ITextLinkExternalProps extends React.PropsWithChildren {
    title: string
    href: string
    textLink: string
    linkBack?: boolean
    noVisitedState?: boolean
    newTab?: boolean
    inverse?: boolean
    noUnderline?: boolean
}

export const TextLinkExternal = forwardRef<HTMLBodyElement, ITextLinkExternalProps>(
    ({ title, href, textLink, linkBack, noVisitedState, newTab, inverse, noUnderline }) => {
        return (
            <>
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
                    rel={newTab ? 'noreferrer noopener' : undefined}
                    target={newTab ? '_blank' : undefined}
                >
                    {textLink}
                </a>
            </>
        )
    },
)

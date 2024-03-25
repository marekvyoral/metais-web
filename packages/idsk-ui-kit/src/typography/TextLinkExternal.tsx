import classNames from 'classnames'
import React, { PropsWithChildren, forwardRef } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'
interface ITextLinkExternalProps extends PropsWithChildren {
    title: string
    href: string
    textLink: string
    linkBack?: boolean
    noVisitedState?: boolean
    newTab?: boolean
    inverse?: boolean
    noUnderline?: boolean
    isInvalid?: boolean
    textBodySize?: boolean
}

export const TextLinkExternal = forwardRef<HTMLAnchorElement, ITextLinkExternalProps>(
    ({ title, href, textLink, linkBack, noVisitedState, newTab, inverse, noUnderline, isInvalid, textBodySize }, ref) => {
        return (
            <>
                <Link
                    ref={ref}
                    className={classNames(
                        { 'govuk-body': !!textBodySize },
                        'govuk-link',
                        { 'govuk-link--no-visited-state': !!noVisitedState },
                        { 'govuk-link--inverse': !!inverse },
                        { 'govuk-link--no-underline': !!noUnderline },
                        { 'link-back': !!linkBack },
                        { [styles.invalidated]: isInvalid },
                    )}
                    to={href}
                    title={title}
                    rel={newTab ? 'noreferrer noopener' : undefined}
                    target={newTab ? '_blank' : undefined}
                >
                    {textLink}
                </Link>
            </>
        )
    },
)

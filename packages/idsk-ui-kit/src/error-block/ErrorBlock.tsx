import React, { useId } from 'react'
import classNames from 'classnames'

import styles from './error-block.module.scss'

import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'

export interface ErrorBlockProps {
    errorTitle?: string
    errorMessage?: React.ReactNode
    buttons?: { label: string; onClick: () => void }[]
    hidden?: boolean
}

export const ErrorBlock: React.FC<ErrorBlockProps> = ({ errorTitle, errorMessage, buttons, hidden }) => {
    const id = useId()
    const errorSummaryTitleId = `error-summary-title-${id}`
    return (
        <div
            className={classNames('govuk-error-summary', { 'govuk-visually-hidden': hidden })}
            aria-labelledby={errorSummaryTitleId}
            role="alert"
            data-module="govuk-error-summary"
        >
            {errorTitle && (
                <h2 className="govuk-error-summary__title" id={errorSummaryTitleId}>
                    {errorTitle}
                </h2>
            )}
            <div className="govuk-error-summary__body">
                {errorMessage && <p>{errorMessage}</p>}
                {buttons && (
                    <ul className="govuk-list govuk-error-summary__list">
                        {buttons?.map((button) => (
                            <li key={button.label}>
                                <ButtonLink label={button.label} onClick={button.onClick} className={styles.redColor} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

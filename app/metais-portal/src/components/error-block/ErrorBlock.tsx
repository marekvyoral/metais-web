import React, { useId } from 'react'

import { ButtonLink } from '../button-link/ButtonLink'

import styles from './error-block.module.scss'

interface ErrorBlockProps {
    errorTitle?: string
    errorMessage?: string
    buttons?: { label: string; onClick: () => void }[]
}

export const ErrorBlock: React.FC<ErrorBlockProps> = ({ errorTitle, errorMessage, buttons }) => {
    const id = useId()
    const errorSummaryTitleId = `error-summary-title-${id}`
    return (
        <div className="govuk-error-summary" aria-labelledby={errorSummaryTitleId} role="alert" data-module="govuk-error-summary">
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

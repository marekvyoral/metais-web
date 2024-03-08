import React, { useId } from 'react'

import { ButtonLink } from '../button-link/ButtonLink'

import styles from './error-block-list.module.scss'

export interface ErrorBlock {
    errorTitle?: string
    errorMessage?: string
}

export interface ErrorBlockListProps {
    errorList: ErrorBlock[]
    buttons?: { label: string; onClick: () => void }[]
}

export const ErrorBlockList: React.FC<ErrorBlockListProps> = ({ errorList, buttons }) => {
    const id = useId()
    const errorSummaryTitleId = `error-summary-title-${id}`
    return (
        <>
            {errorList.length > 0 && (
                <div className="govuk-error-summary" aria-labelledby={errorSummaryTitleId} data-module="govuk-error-summary">
                    {errorList.map((error: ErrorBlock, index) => (
                        <React.Fragment key={index}>
                            {error.errorTitle && (
                                <h2 className="govuk-error-summary__title" id={errorSummaryTitleId}>
                                    {error.errorTitle}
                                </h2>
                            )}
                            <div className="govuk-error-summary__body">
                                {error.errorMessage && <p>{error.errorMessage}</p>}
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
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    )
}

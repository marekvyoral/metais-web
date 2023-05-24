import React, { forwardRef } from 'react'

interface ITextHiddenProps extends React.PropsWithChildren {
    summaryText: string
}

export const TextHidden = forwardRef<HTMLDetailsElement, ITextHiddenProps>(({ children, summaryText }, ref) => {
    return (
        <details className="govuk-details" ref={ref}>
            <summary className="govuk-details__summary">
                <span className="govuk-details__summary-text">{summaryText}</span>
            </summary>
            <div className="govuk-details__text">{children}</div>
        </details>
    )
})

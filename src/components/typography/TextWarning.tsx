import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextWarningProps extends PropsWithChildren {
    assistive?: string
}

export const TextWarning = forwardRef<HTMLDivElement, ITextWarningProps>(({ children, assistive }, ref) => {
    return (
        <div className="govuk-warning-text" ref={ref}>
            <span className="govuk-warning-text__icon" aria-hidden="true">
                !
            </span>
            <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">{assistive}</span>
                {children}
            </strong>
        </div>
    )
})

import React, { forwardRef } from 'react'

interface ITextBodyProps extends React.PropsWithChildren {
    assistive?: string
}

export const TextWarning = forwardRef<HTMLBodyElement, ITextBodyProps>(({ children, assistive }) => {
    return (
        <div className="govuk-warning-text">
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

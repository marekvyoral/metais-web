import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextListProps extends PropsWithChildren {
    variant?: 'bullet' | 'number'
}

export const TextList = forwardRef<HTMLOListElement, ITextListProps>(({ children, variant }, ref) => {
    return (
        <>
            {!variant && (
                <ul ref={ref} className="govuk-list">
                    {children}
                </ul>
            )}
            {variant === 'bullet' && (
                <ul ref={ref} className="govuk-list govuk-list--bullet">
                    {children}
                </ul>
            )}
            {variant === 'number' && (
                <ol ref={ref} className="govuk-list govuk-list--number">
                    {children}
                </ol>
            )}
        </>
    )
})

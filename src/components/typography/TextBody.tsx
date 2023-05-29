import React, { PropsWithChildren, forwardRef } from 'react'

interface ITextBodyProps extends PropsWithChildren {
    size?: 'S' | 'L'
}

export const TextBody = forwardRef<HTMLParagraphElement, ITextBodyProps>(({ children, size }, ref) => {
    return (
        <>
            {!size && (
                <p ref={ref} className="govuk-body">
                    {children}
                </p>
            )}
            {size === 'S' && (
                <p ref={ref} className="govuk-body-s">
                    {children}
                </p>
            )}
            {size === 'L' && (
                <p ref={ref} className="govuk-body-l">
                    {children}
                </p>
            )}
        </>
    )
})

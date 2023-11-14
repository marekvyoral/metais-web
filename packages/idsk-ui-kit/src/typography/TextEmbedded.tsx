import React, { forwardRef } from 'react'

export const TextEmbedded = forwardRef<HTMLDivElement, React.PropsWithChildren>(({ children }, ref) => {
    return (
        <div ref={ref} className="govuk-inset-text">
            {children}
        </div>
    )
})

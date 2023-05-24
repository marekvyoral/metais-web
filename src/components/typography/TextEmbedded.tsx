import React, { forwardRef } from 'react'

export const TextEmbedded = forwardRef<HTMLDivElement, React.PropsWithChildren>(({ children }) => {
    return (
        <>
            <div className="govuk-inset-text">{children}</div>
        </>
    )
})

import React, { forwardRef } from 'react'

export const TextEmbedded = forwardRef<HTMLBodyElement, React.PropsWithChildren>(({ children }) => {
    return (
        <>
            <div className="govuk-inset-text">{children}</div>
        </>
    )
})

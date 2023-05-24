import React, { forwardRef } from 'react'

interface ITextBodyProps extends React.PropsWithChildren {
    size?: 'S' | 'L'
}

export const TextBody = forwardRef<HTMLBodyElement, ITextBodyProps>(({ children, size }) => {
    return (
        <>
            {!size && <p className="govuk-body">{children}</p>}
            {size === 'S' && <p className="govuk-body-s">{children}</p>}
            {size === 'L' && <p className="govuk-body-l">{children}</p>}
        </>
    )
})

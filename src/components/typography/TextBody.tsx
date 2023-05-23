import * as React from 'react'
import { forwardRef } from 'react'

interface ITextBodyProps extends React.PropsWithChildren {
    size: 'S' | 'L' | 'default'
}

export const TextBody = forwardRef<HTMLBodyElement, ITextBodyProps>(({ children, size }) => {
    return (
        <>
            {size === 'default' && <p className="govuk-body">{children}</p>}
            {size === 'S' && <p className="govuk-body-s">{children}</p>}
            {size === 'L' && <p className="govuk-body-l">{children}</p>}
        </>
    )
})

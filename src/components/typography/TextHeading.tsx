import React, { forwardRef } from 'react'

interface ITextHeadingProps extends React.PropsWithChildren {
    size: 'S' | 'M' | 'L' | 'XL'
}
export const TextHeading = forwardRef<HTMLHeadingElement, ITextHeadingProps>(({ children, size }) => {
    return (
        <>
            {size === 'XL' && <h1 className="govuk-heading-xl">{children}</h1>}
            {size === 'L' && <h2 className="govuk-heading-l">{children}</h2>}
            {size === 'M' && <h3 className="govuk-heading-m">{children}</h3>}
            {size === 'S' && <h4 className="govuk-heading-s">{children}</h4>}
        </>
    )
})

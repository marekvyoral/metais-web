import React, { forwardRef } from 'react'

interface ITextListProps extends React.PropsWithChildren {
    variant?: 'bullet' | 'number'
}

export const TextList = forwardRef<HTMLBodyElement, ITextListProps>(({ children, variant }) => {
    return (
        <>
            {!variant && <ul className="govuk-list">{children}</ul>}
            {variant === 'bullet' && <ul className="govuk-list govuk-list--bullet">{children}</ul>}
            {variant === 'number' && <ol className="govuk-list govuk-list--number">{children}</ol>}
        </>
    )
})

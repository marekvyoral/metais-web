import * as React from 'react'
import { forwardRef } from 'react'

interface ITextListProps extends React.PropsWithChildren {
    bullet?: boolean
    number?: boolean
}

export const TextList = forwardRef<HTMLBodyElement, ITextListProps>(({ children, bullet, number }) => {
    return (
        <>
            {!bullet && !number && <ul className="govuk-list">{children}</ul>}
            {bullet && <ul className="govuk-list govuk-list--bullet">{children}</ul>}
            {number && <ol className="govuk-list govuk-list--number">{children}</ol>}
        </>
    )
})

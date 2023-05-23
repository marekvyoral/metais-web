import React from 'react'

export const GridRow: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className="govuk-grid-row">{children}</div>
}

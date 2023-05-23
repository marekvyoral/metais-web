import React from 'react'

interface IGridColProps extends React.PropsWithChildren {
    setWidth?: 'full' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter'
}

export const GridCol: React.FC<IGridColProps> = ({ children, setWidth = 'full' }) => {
    return <div className={`govuk-grid-column-${setWidth}`}>{children}</div>
}

import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

interface IGridRowProps extends PropsWithChildren {
    className?: string
}

export const GridRow: React.FC<IGridRowProps> = ({ children, className }) => {
    return <div className={classNames('govuk-grid-row', className)}>{children}</div>
}

import classNames from 'classnames'
import React, { PropsWithChildren } from 'react'

interface IGridColProps extends PropsWithChildren {
    setWidth?: 'full' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter'
    className?: string
}

export const GridCol: React.FC<IGridColProps> = ({ children, setWidth = 'full', className }) => {
    return <div className={classNames(`govuk-grid-column-${setWidth}`, className)}>{children}</div>
}

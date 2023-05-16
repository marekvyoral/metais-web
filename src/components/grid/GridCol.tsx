import React, { ReactElement } from 'react'

interface IGridColProps {
  children: ReactElement
  setWidth: 'full' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter'
}

export const GridCol = ({ children, setWidth }: IGridColProps) => {
  return <div className={`govuk-grid-column-${setWidth}`}>{children}</div>
}

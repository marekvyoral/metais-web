import React, { ReactElement } from 'react'

interface IGridRowProps {
  children: ReactElement[] | ReactElement
}

export const GridRow = ({ children }: IGridRowProps) => {
  return <div className="govuk-grid-row">{children}</div>
}

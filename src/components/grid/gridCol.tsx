import React, { ReactElement, useMemo, useState } from 'react';

interface IGridColProps {
    children: ReactElement;
    setWidth: 'full' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter';
}

const GridCol = ({ children, setWidth }: IGridColProps) => {
    return <div className={`govuk-grid-column-${setWidth}`}>{children}</div>;
};

export default GridCol;


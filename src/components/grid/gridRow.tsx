import { ReactElement, ReactNode } from 'react';

interface IGridRowProps {
    children: ReactElement[] | ReactElement;
}

const GridRow = ({ children }: IGridRowProps) => {
    return <div className="govuk-grid-row">{children}</div>;
};

export default GridRow;

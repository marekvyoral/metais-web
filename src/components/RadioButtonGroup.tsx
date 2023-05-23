import React, { forwardRef } from 'react'

interface IRadioButtonGroupProps extends React.PropsWithChildren {
    inline?: boolean
}

export const RadioButtonGroup = forwardRef<HTMLInputElement, IRadioButtonGroupProps>(({ children, inline }) => {
    return (
        <>
            {!inline && <div className="govuk-radios">{children}</div>}
            {inline && <div className="govuk-radios govuk-radios--inline">{children}</div>}
        </>
    )
})

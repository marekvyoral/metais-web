import React from 'react'

export const MainContentWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="govuk-width-container" id="main-content">
            <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">{children}</main>
        </div>
    )
}

import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@isdd/metais-common/src/components/sidebar/Sidebar'
import styles from '@isdd/metais-common/src/components/GridView.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { getAdminNavItems } from './Navbar'

export const MainContentWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation()
    const { userInfo: user } = useAuth()

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    const sidebarSections = getAdminNavItems(t, user?.roles ?? null)
    return (
        <div className={classNames(styles.container)} id="main-content">
            {sidebarSections.length > 0 && (
                <Sidebar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} sections={sidebarSections} />
            )}

            <main
                className={classNames(
                    'govuk-main-wrapper govuk-main-wrapper--auto-spacing',
                    styles.content,
                    !isSidebarExpanded && styles.closedContent,
                )}
            >
                {children}
            </main>
        </div>
    )
}

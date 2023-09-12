import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@isdd/metais-common/src/components/sidebar/Sidebar'
import styles from '@isdd/metais-common/src/components/GridView.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { getPortalNavigationItems } from './navbar/navigationItems'

export const MainContentWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    return (
        <div className={classNames(styles.container)} id="main-content">
            <Sidebar
                isSidebarExpanded={isSidebarExpanded}
                setIsSidebarExpanded={setIsSidebarExpanded}
                sections={getPortalNavigationItems(t, !!user)}
            />

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

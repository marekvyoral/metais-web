import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@isdd/metais-common/src/components/sidebar/Sidebar'
import styles from '@isdd/metais-common/src/components/GridView.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { getPortalNavigationItems } from './navbar/navigationItems'
import { GlobalSearchFilter } from './global-search-filter/GlobalSearchFilter'

type MainContentWrapperProps = React.PropsWithChildren & {
    globalSearch?: boolean
    noSideMenu?: boolean
}

export const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children, globalSearch, noSideMenu }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    const isSideMenu = true

    return (
        <div className={classNames({ [styles.container]: !noSideMenu })}>
            {!globalSearch && !noSideMenu && (
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    sections={getPortalNavigationItems(t, !!user, isSideMenu)}
                />
            )}

            {globalSearch && <GlobalSearchFilter />}

            <main
                id="main-content"
                className={classNames(
                    'govuk-main-wrapper govuk-main-wrapper--auto-spacing',
                    !noSideMenu && styles.content,
                    !isSidebarExpanded && styles.closedContent,
                )}
            >
                {children}
            </main>
        </div>
    )
}

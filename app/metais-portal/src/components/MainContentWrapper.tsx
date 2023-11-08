import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@isdd/metais-common/src/components/sidebar/Sidebar'
import styles from '@isdd/metais-common/src/components/GridView.module.scss'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'

import { getPortalNavigationItems } from './navbar/navigationItems'
import { GlobalSearchFilter } from './global-search-filter/GlobalSearchFilter'

type MainContentWrapperProps = React.PropsWithChildren & {
    globalSearch?: boolean
    noSideMenu?: boolean
}

export const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children, globalSearch, noSideMenu }) => {
    const { t } = useTranslation()
    const {
        state: { userInfo: user },
    } = useAuth()

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    const isSideMenu = true

    const { data: ksisvsGroup } = useFind2111({ shortName: KSIVS_SHORT_NAME })
    return (
        <div className={classNames({ [styles.container]: !noSideMenu })} id="main-content">
            {!globalSearch && !noSideMenu && (
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    sections={getPortalNavigationItems(t, !!user, Array.isArray(ksisvsGroup) ? ksisvsGroup[0].uuid : ksisvsGroup?.uuid, isSideMenu)}
                />
            )}

            {globalSearch && <GlobalSearchFilter />}

            <main
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

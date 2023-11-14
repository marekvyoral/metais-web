import React, { SetStateAction, useMemo, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { NavMenuList } from './NavMenuList'
import { closeOnClickOutside, closeOnEscapeKey } from './navMenuUtils'

import { useCurrentTab } from '@isdd/metais-common/hooks/useCurrentTab'
import { NavLogin } from '@isdd/metais-common/components/navbar/navbar-main/NavLogin'
import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface INavMenu {
    isMenuExpanded: boolean
    setIsMenuExpanded: React.Dispatch<SetStateAction<boolean>>
    navItems: NavigationItem[]
}

export const NavMenu: React.FC<INavMenu> = ({ isMenuExpanded, setIsMenuExpanded, navItems }) => {
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<string | undefined>()
    const {
        state: { user },
    } = useAuth()
    const location = useLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const paths = useMemo(() => navItems.map((item) => item.path), [])

    useCurrentTab(paths, setActiveTab)

    return (
        <div
            onBlur={(event) => closeOnClickOutside<boolean>(event, setIsMenuExpanded, false)}
            onKeyDown={(event) => closeOnEscapeKey<boolean>(event, setIsMenuExpanded, false)}
            className={classNames({ 'idsk-header-web__nav': true, 'idsk-header-web__nav--mobile': !isMenuExpanded })}
        >
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full" />
                    <div className="govuk-grid-column-full">
                        <nav
                            onBlur={(event) => closeOnClickOutside<string | undefined>(event, setActiveTab, undefined)}
                            onKeyDown={(event) => closeOnEscapeKey<string | undefined>(event, setActiveTab, undefined)}
                            className="idsk-header-web__nav-bar--buttons"
                        >
                            <NavMenuList activeTab={activeTab} setActiveTab={setActiveTab} menuItems={navItems} />
                        </nav>
                    </div>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="idsk-header-web__main--buttons">
                            {user ? (
                                <button className={classNames('idsk-button idsk-button--secondary', styles.noWrap)}>{t('navbar.newItem')}</button>
                            ) : (
                                <div className={classNames(styles.registerLink, styles.fullWidth)}>
                                    <Link className="govuk-link" to="#" onClick={(e) => e.preventDefault()} state={{ from: location }}>
                                        {t('navbar.registration')}
                                    </Link>
                                </div>
                            )}

                            <NavLogin />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

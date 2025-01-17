import React, { SetStateAction, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, matchPath, useLocation } from 'react-router-dom'

import { NavLogin } from '../navbar-main/NavLogin'

import styles from './../navbar.module.scss'
import { NavMenuList } from './NavMenuList'
import { closeOnClickOutside, closeOnEscapeKey } from './navMenuUtils'

import { RouteNames } from '@/navigation/routeNames'

interface INavMenu {
    isMenuExpanded: boolean
    loggedIn: boolean
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>
    setIsMenuExpanded: React.Dispatch<SetStateAction<boolean>>
    handleLogout: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

export const navItems = [
    RouteNames.HOW_TO_EGOV_COMPONENTS,
    RouteNames.HOW_TO_DATA_OBJECTS,
    RouteNames.HOW_TO_MONITORING,
    RouteNames.HOW_TO_STANDARDIZATION,
]

export const NavMenu: React.FC<INavMenu> = ({ isMenuExpanded, handleLogout, setIsMenuExpanded, loggedIn, setLoggedIn }) => {
    const { t } = useTranslation()
    const location = useLocation()

    const [activeTab, setActiveTab] = useState<RouteNames | undefined>()

    useEffect(() => {
        const currentTab = navItems.find((tab) => {
            const match = matchPath(
                {
                    path: tab,
                    caseSensitive: false,
                    end: false,
                },
                location.pathname,
            )
            return match
        })

        setActiveTab(currentTab)
    }, [location.pathname])

    return (
        <div
            onBlur={(event) => closeOnClickOutside<boolean>(event, setIsMenuExpanded, false)}
            onKeyDown={(event) => closeOnEscapeKey<boolean>(event, setIsMenuExpanded, false)}
            className={classnames({ 'idsk-header-web__nav': true, 'idsk-header-web__nav--mobile': !isMenuExpanded })}
        >
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full" />
                    <div className="govuk-grid-column-full">
                        <nav
                            onBlur={(event) => closeOnClickOutside<RouteNames | undefined>(event, setActiveTab, undefined)}
                            onKeyDown={(event) => closeOnEscapeKey<RouteNames | undefined>(event, setActiveTab, undefined)}
                            className="idsk-header-web__nav-bar--buttons"
                        >
                            <NavMenuList activeTab={activeTab} setActiveTab={setActiveTab} />
                        </nav>
                    </div>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="idsk-header-web__main--buttons">
                            {loggedIn ? (
                                <button className={classnames('idsk-button idsk-button--secondary', styles.noWrap)}>{t('navbar.newItem')}</button>
                            ) : (
                                <div className={classnames(styles.registerLink, styles.fullWidth)}>
                                    <Link className="govuk-link" to="#" onClick={(e) => e.preventDefault()}>
                                        {t('navbar.registration')}
                                    </Link>
                                </div>
                            )}

                            <NavLogin loggedIn={loggedIn} setLoggedIn={setLoggedIn} handleLogout={handleLogout} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

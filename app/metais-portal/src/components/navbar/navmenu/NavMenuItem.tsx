import classnames from 'classnames'
import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { navItems } from './NavMenu'

interface INavMenuItem {
    path: string
    list: { title: string; path: string }[]
    title: string
    activeTab: string | undefined
    setActiveTab: React.Dispatch<SetStateAction<RouteNames | undefined>>
}

export const NavMenuItem: React.FC<INavMenuItem> = ({ list, title, path, activeTab, setActiveTab }) => {
    const { t } = useTranslation()
    const showMenu = `${t('navMenu.show')} ${title} menu`
    const hideMenu = `${t('navMenu.hide')} ${title} menu`

    const handleShouldCloseOnClick = () => {
        if (path === activeTab && activeTab !== undefined) {
            setActiveTab(undefined)
        } else {
            setActiveTab(navItems.find((item) => item === path))
        }
    }

    return (
        <li
            onClick={handleShouldCloseOnClick}
            className={classnames({
                'idsk-header-web__nav-list-item': true,
                'idsk-header-web__nav-list-item--active': activeTab === path,
            })}
        >
            <Link
                className="govuk-link idsk-header-web__nav-list-item-link"
                title={title}
                to={`/${path}`}
                aria-label={activeTab === path ? hideMenu : showMenu}
                aria-expanded={activeTab === path}
                data-text-for-hide={hideMenu}
                data-text-for-show={showMenu}
            >
                {title} <div className="idsk-header-web__link-arrow" />
                <div className="idsk-header-web__link-arrow-mobile" />
            </Link>
            <div className="idsk-header-web__nav-submenu">
                <div className="govuk-width-container">
                    <div className="govuk-grid-row">
                        <ul className="idsk-header-web__nav-submenu-list" aria-label={t('navMenu.innerNav')}>
                            {list.map((item) => (
                                <li key={item.title} className="idsk-header-web__nav-submenu-list-item">
                                    <Link className="govuk-link idsk-header-web__nav-submenu-list-item-link" to={item.path} title={item.title}>
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    )
}

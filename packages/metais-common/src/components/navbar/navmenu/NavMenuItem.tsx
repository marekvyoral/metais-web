import classnames from 'classnames'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
interface INavMenuItem {
    path: string
    list: { title: string; path: string }[]
    title: string
    activeTab: string | undefined
    setActiveTab: React.Dispatch<SetStateAction<string | undefined>>
    navItems?: {
        title: string
        path: string
        subItems?: {
            title: string
            path: string
        }[]
    }[]
}

export const NavMenuItem: React.FC<INavMenuItem> = ({ list, title, path, activeTab, setActiveTab, navItems }) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
    const ref = useRef<HTMLLIElement>(null)

    const showMenu = `${t('navMenu.show')} ${title} menu`
    const hideMenu = `${t('navMenu.hide')} ${title} menu`
    const location = useLocation()
    const handleShouldCloseOnClick = () => {
        setExpanded(!expanded)
        if (path === activeTab && activeTab !== undefined) {
            setActiveTab(undefined)
        } else {
            setActiveTab(navItems?.find((item) => item?.path === path)?.path)
        }
    }

    const handleClickOutside = (event: PointerEvent) => {
        if (ref.current && !ref.current?.contains(event.target as Node)) {
            setExpanded(false)
        }
    }

    useEffect(() => {
        document.addEventListener('pointerdown', handleClickOutside, true)
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside, true)
        }
    }, [])

    return (
        <li
            ref={ref}
            onClick={handleShouldCloseOnClick}
            className={classnames(
                {
                    'idsk-header-web__nav-list-item': true,
                    'idsk-header-web__nav-list-item--active': expanded,
                },
                styles.navListItemOverride,
            )}
        >
            <Link
                className={classnames('govuk-link idsk-header-web__nav-list-item-link', styles.navListItemOvverride)}
                state={{ from: location }}
                to={`/${path}`}
                aria-label={expanded ? hideMenu : showMenu}
                aria-expanded={expanded}
                data-text-for-hide={hideMenu}
                data-text-for-show={showMenu}
            >
                {title}
                {list.length >= 1 && (
                    <>
                        <div className={classnames('idsk-header-web__link-arrow-mobile', styles.marginLeftAuto)} />
                        <div
                            onClick={(event) => {
                                event.preventDefault()
                                setExpanded(!expanded)
                            }}
                        >
                            <div className={classnames(styles.iconGroupDesktop, 'idsk-header-web__link-arrow', styles.navListItemArrowOvverride)} />
                        </div>
                    </>
                )}
            </Link>
            <div className="idsk-header-web__nav-submenu">
                <div className="govuk-width-container">
                    <div className="govuk-grid-row">
                        <ul className="idsk-header-web__nav-submenu-list" aria-label={t('navMenu.innerNav')}>
                            {list.map((item) => (
                                <li key={item.title} className="idsk-header-web__nav-submenu-list-item">
                                    <Link
                                        className="govuk-link idsk-header-web__nav-submenu-list-item-link"
                                        state={{ from: location }}
                                        to={item.path}
                                        title={item.title}
                                    >
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

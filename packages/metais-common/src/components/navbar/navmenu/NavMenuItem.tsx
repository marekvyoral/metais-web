import classnames from 'classnames'
import React, { SetStateAction, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useMatch } from 'react-router-dom'

import { NavMenuSubItem } from './NavMenuSubItem'

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
    const itemsWrapperId = useId()

    const showMenu = `${t('navMenu.show')} ${title} menu`
    const hideMenu = `${t('navMenu.hide')} ${title} menu`
    const location = useLocation()
    const isUrlMatched = !!useMatch(path)
    const handleShouldCloseOnClick = () => {
        setExpanded(!expanded)
        if (path === activeTab && activeTab !== undefined) {
            setActiveTab(undefined)
        } else {
            setActiveTab(navItems?.find((item) => item?.path === path)?.path)
        }
    }
    const handleShouldCloseOnEscape = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape' && expanded) {
            handleShouldCloseOnClick()
        }
    }

    const handleClickOutside = (event: PointerEvent) => {
        if (ref.current && !ref.current?.contains(event.target as Node)) {
            setExpanded(false)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && ref.current && !ref.current?.contains(event.target as Node)) {
            setExpanded(false)
        }
    }

    useEffect(() => {
        document.addEventListener('pointerdown', handleClickOutside, true)
        document.addEventListener('keydown', handleKeyDown, true)
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside, true)
            document.removeEventListener('keydown', handleKeyDown, true)
        }
    }, [])

    return (
        <li
            ref={ref}
            onClick={handleShouldCloseOnClick}
            onKeyDown={handleShouldCloseOnEscape}
            className={classnames({
                'idsk-header-web__nav-list-item': true,
                'idsk-header-web__nav-list-item--active': expanded,
            })}
        >
            <Link
                className={classnames('govuk-link idsk-header-web__nav-list-item-link', styles.navListItemOvverride)}
                state={{ from: location }}
                to={path}
                aria-label={list.length ? (expanded ? hideMenu : showMenu) : undefined}
                aria-expanded={list.length ? expanded : undefined}
                aria-controls={list.length ? itemsWrapperId : undefined}
                aria-haspopup={list.length ? 'menu' : undefined}
                aria-current={isUrlMatched ? 'page' : undefined}
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
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    setExpanded(false)
                                }
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
                        <ul id={itemsWrapperId} className="idsk-header-web__nav-submenu-list" aria-label={t('navMenu.innerNav') ?? ''}>
                            {list.map((item) => (
                                <NavMenuSubItem key={item.title} {...item} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    )
}

import React from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'

interface INavMenuSubItem {
    title: string
    path: string
}

export const NavMenuSubItem: React.FC<INavMenuSubItem> = ({ title, path }) => {
    const isUrlMatched = !!useMatch(path)
    const location = useLocation()

    return (
        <li className="idsk-header-web__nav-submenu-list-item">
            <Link
                className="govuk-link idsk-header-web__nav-submenu-list-item-link"
                state={{ from: location }}
                to={path}
                title={title}
                aria-current={isUrlMatched ? 'page' : undefined}
            >
                <span>{title}</span>
            </Link>
        </li>
    )
}

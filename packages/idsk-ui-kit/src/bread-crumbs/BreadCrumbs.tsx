import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useBackButtonNavigate } from '@isdd/metais-common/src/hooks/useBackButtonNavigate'
import classNames from 'classnames'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

import styles from './breadCrumbs.module.scss'

export type BreadCrumbsItemProps = {
    icon?: string
    href: string
    label: string
    toLogin?: boolean
    isCurrent?: boolean
}

type BreadCrumbsProps = {
    links: BreadCrumbsItemProps[]
    withWidthContainer?: boolean
}

const BreadCrumbsItem: React.FC<BreadCrumbsItemProps> = ({ icon, href, label, toLogin, isCurrent = false }) => {
    const { backButtonNavigate } = useBackButtonNavigate(href)
    const { login } = useContext<IAuthContext>(AuthContext)

    //to work properly Link component must send state with location
    // location = useLocation()
    // <Link to={href} state={{from: location}} /> or with navigate
    // navigate("href", { state: { from: location } });
    const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        if (toLogin) {
            login()
        } else {
            backButtonNavigate()
        }
    }

    return (
        <li className="govuk-breadcrumbs__list-item">
            {isCurrent ? (
                <span aria-current="page">{label}</span>
            ) : (
                <Link className="govuk-breadcrumbs__link" to={href} onClick={(e) => handleNavigate(e)}>
                    {icon && <img src={icon} alt="" className={styles.linkIcon} />}
                    {label}
                </Link>
            )}
        </li>
    )
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ links, withWidthContainer }) => {
    return (
        <div className={classNames(styles.marginBottom, { 'govuk-width-container': withWidthContainer })}>
            <div className={classNames(styles.paddingBreadcrumb, 'govuk-breadcrumbs', 'govuk-grid-row')}>
                <ul className="govuk-breadcrumbs__list">
                    {links.map((value, index) => (
                        <BreadCrumbsItem
                            href={value.href}
                            label={value.label}
                            icon={value.icon}
                            key={`${value.label}_${index}`}
                            toLogin={value.toLogin}
                            isCurrent={index + 1 === links.length}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

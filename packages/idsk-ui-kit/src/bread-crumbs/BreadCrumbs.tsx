import React from 'react'
import { Link } from 'react-router-dom'
import { useBackButtonNavigate } from '@isdd/metais-common/src/hooks/useBackButtonNavigate'
import classNames from 'classnames'

import styles from './breadCrumbs.module.scss'

type BreadCrumbsItemProps = {
    icon?: string
    href: string
    label: string
}

type BreadCrumbsProps = {
    links: BreadCrumbsItemProps[]
    withWidthContainer?: boolean
}

const BreadCrumbsItem: React.FC<BreadCrumbsItemProps> = ({ icon, href, label }) => {
    const { backButtonNavigate } = useBackButtonNavigate(href)
    //to work properly Link component must send state with location
    // location = useLocation()
    // <Link to={href} state={{from: location}} /> or with navigate
    // navigate("href", { state: { from: location } });
    const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        backButtonNavigate()
    }

    return (
        <li className="govuk-breadcrumbs__list-item">
            <Link className="govuk-breadcrumbs__link" to="#" onClick={(e) => handleNavigate(e)}>
                {icon && <img src={icon} alt="icon" className={styles.linkIcon} />}
                {label}
            </Link>
        </li>
    )
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ links, withWidthContainer }) => {
    return (
        <div className={classNames(styles.marginBottom, { 'govuk-width-container': withWidthContainer })}>
            <div className="govuk-breadcrumbs">
                <ul className="govuk-breadcrumbs__list">
                    {links.map((value) => (
                        <BreadCrumbsItem href={value.href} label={value.label} icon={value.icon} key={value.label} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

import React from 'react'

import styles from '@portal/components/bread-crumbs/breadCrumbs.module.scss'

type BreadCrumbsItemProps = {
    icon?: string
    href: string
    label: string
}

type BreadCrumbsProps = {
    links: BreadCrumbsItemProps[]
}

const BreadCrumbsItem: React.FC<BreadCrumbsItemProps> = ({ icon, href, label }) => {
    return (
        <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href={href}>
                {icon && <img src={icon} alt="icon" className={styles.linkIcon} />}
                {label}
            </a>
        </li>
    )
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ links }) => {
    return (
        <div className="govuk-breadcrumbs">
            <ul className="govuk-breadcrumbs__list">
                {links.map((value) => (
                    <BreadCrumbsItem href={value.href} label={value.label} icon={value.icon} key={value.label} />
                ))}
            </ul>
        </div>
    )
}

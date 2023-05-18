import * as React from 'react'
import './breadCrumbs.scss'

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
                {icon && <img src={icon} alt="icon" />}
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

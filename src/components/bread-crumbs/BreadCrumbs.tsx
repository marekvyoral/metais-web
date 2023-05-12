import * as React from 'react';
import './breadCrumbs.scss'

type BreadCrumbsProps = {
    links: BreadCrumbsItemProps[]
  }

type BreadCrumbsItemProps = {
    icon?: string
    href: string
    label: string
  }

const BreadCrumbsItem: React.FC<BreadCrumbsItemProps> = ({icon, href, label, ...props}) => {
    return (
        <li className='govuk-breadcrumbs__list-item'>
            <a className='govuk-breadcrumbs__link' href={href}>
                {icon && <img src={icon} alt='icon'/>}
                {label}
            </a>
        </li>
    )
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({links, ...props}) => {
    return (  
            <div className='govuk-breadcrumbs'>
                <ul className='govuk-breadcrumbs__list'>
                    {links.map(value => <BreadCrumbsItem href={value.href} label={value.label} icon={value.icon} />)}
                </ul>
        </div>

    )
}

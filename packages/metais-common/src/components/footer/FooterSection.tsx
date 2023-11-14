import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

import styles from './footer.module.scss'

export type FooterItem = {
    label: string
    href: string
}

export type FooterSection = {
    itemList: FooterItem[]
    header: string
    columnsCount?: number
}

export const FooterSection: React.FC<FooterSection> = ({ itemList, header, columnsCount = 1 }) => {
    return (
        <div className="govuk-footer__section">
            <h2 className="govuk-footer__heading govuk-heading-m">{header}</h2>
            <ul className={`govuk-footer__list govuk-footer__list--columns-${columnsCount}`}>
                {itemList.map((item, index) => (
                    <li key={index} className={classNames('govuk-footer__list-item', styles.liMaxWidth)}>
                        <Link className="govuk-footer__link" to={item.href}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

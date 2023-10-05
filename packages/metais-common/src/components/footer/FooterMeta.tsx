import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './footer.module.scss'

import { FooterRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'

export type FooterMetaList = {
    label: string
    href: string
}

type Props = {
    metaList: FooterMetaList[]
}

export const FooterMeta: React.FC<Props> = ({ metaList }) => {
    const { t } = useTranslation()

    return (
        <div className={classNames('govuk-footer__meta', styles.metaDiv)}>
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                <h2 className="govuk-visually-hidden">Odkazy na podporu</h2>
                <div className="govuk-footer__meta-custom">{t('footer.operatorMIRRI')}</div>
                <div className="govuk-footer__meta-custom">
                    {t('footer.createdInAccordance')}
                    <Link className="govuk-footer__link" to={FooterRouteNames.IDSK_DIZAJN}>
                        {t('footer.idsk')}
                    </Link>
                </div>

                <ul className={classNames('govuk-footer__inline-list', styles.ul)}>
                    {metaList.map((item, index) => (
                        <li key={index} className="govuk-footer__inline-list-item">
                            <Link className="govuk-footer__link" to={item.href}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="govuk-grid-column-one-third idsk-footer-extended-logo-box">
                <Link to={RouteNames.HOME} title={t('footer.home') ?? ''}>
                    <img className="idsk-footer-extended-logo" src="/assets/images/footer-extended-logo.svg" alt={t('footer.MIRRI') ?? ''} />
                </Link>
            </div>
        </div>
    )
}

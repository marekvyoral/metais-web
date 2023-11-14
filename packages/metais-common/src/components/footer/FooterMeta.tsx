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
        <div>
            <div className={classNames('govuk-footer__meta', styles.metaDiv)}>
                <div className="govuk-grid-column-two-thirds idsk-footer-extended-info-links">
                    <div className="govuk-footer__meta-custom">{t('footer.operatorMIRRI')}</div>
                    <div className="govuk-footer__meta-custom">
                        {t('footer.createdInAccordance')}
                        <a className="govuk-footer__link" href={FooterRouteNames.IDSK_DIZAJN} target="_blank" rel="noreferrer">
                            {t('footer.idsk')}
                        </a>
                    </div>
                </div>
                <div className="govuk-grid-column-one-third idsk-footer-extended-logo-box">
                    <Link to={RouteNames.HOME} title={t('footer.home') ?? ''}>
                        <img className="idsk-footer-extended-logo" src="/assets/images/footer-extended-logo.svg" alt={t('footer.MIRRI') ?? ''} />
                    </Link>
                </div>
                <div className={styles.metaList}>
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
            </div>
            <div>
                {t('footer.appVersion')}: {import.meta.env.VITE_APP_VERSION}
            </div>
        </div>
    )
}

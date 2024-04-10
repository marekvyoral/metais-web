import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

interface IHeaderDropDown {
    id: string
    showDropDown: boolean
}

export const HeaderDropDown: React.FC<IHeaderDropDown> = ({ id, showDropDown }) => {
    const { t } = useTranslation()
    const location = useLocation()
    return (
        <div
            className={classnames({
                'idsk-header-web__brand-dropdown': true,
                'idsk-header-web__brand-dropdown--active': showDropDown,
            })}
        >
            <div id={id} className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-half">
                        <h3 className="govuk-body-s">{t('navbar.domain')}</h3>
                        <p className="govuk-body-s">
                            {t('navbar.officialSite')}{' '}
                            <Link
                                className="govuk-link"
                                to="https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci"
                                target="_blank"
                                title={t('navbar.linksToWebs') ?? ''}
                                rel="noreferrer"
                                state={{ from: location }}
                            >
                                {t('navbar.link')}
                            </Link>
                            .
                        </p>
                    </div>
                    <div className="govuk-grid-column-one-half">
                        <h3 className="govuk-body-s">{t('navbar.security')}</h3>
                        <p className="govuk-body-s">{t('navbar.safety')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

import classnames from 'classnames'
import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

interface IInfoDropDown {
    setShowDropDown: React.Dispatch<SetStateAction<boolean>>
    showDropDown: boolean
    isMobile: boolean
    title: string
    label: string
}

export const InfoDropDown: React.FC<IInfoDropDown> = ({ setShowDropDown, showDropDown, isMobile, title, label }) => {
    const { t } = useTranslation()

    return (
        <span
            className={classnames('govuk-body-s', {
                'idsk-header-web__brand-gestor-text': !isMobile,
                'idsk-header-web__brand-gestor-text--mobile': isMobile,
            })}
        >
            {title}
            <button
                onClick={() => setShowDropDown((prev) => !prev)}
                className={classnames({
                    'idsk-header-web__brand-gestor-button': true,
                    'idsk-header-web__brand-gestor-button--active': showDropDown,
                })}
                aria-label={showDropDown ? t('navbar.hideInformationAboutSite') ?? '' : t('navbar.showInformationAboutSite') ?? ''}
                aria-expanded={showDropDown}
                data-text-for-hide={t('navbar.hideInformationAboutSite')}
                data-text-for-show={t('navbar.showInformationAboutSite')}
            >
                {label}
                <span className="idsk-header-web__link-arrow" />
            </button>
        </span>
    )
}

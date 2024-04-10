import React from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Languages } from '@isdd/metais-common/localization/languages'
import { LANGUAGE_STORE_KEY } from '@isdd/metais-common/src/localization/i18next'

import { ButtonPopup } from '@isdd/idsk-ui-kit'

interface ILanguageItem {
    handleClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, lng: Languages, closeHandler: () => void) => void
    value: Languages
    closeHandler: () => void
}

export const LanguageItem: React.FC<ILanguageItem> = ({ handleClick, value, closeHandler }) => {
    const { t, i18n } = useTranslation()
    return (
        <li className="idsk-header-web__brand-language-list-item">
            <a
                className={classnames({
                    'govuk-link idsk-header-web__brand-language-list-item-link': true,
                    'idsk-header-web__brand-language-list-item-link--selected': i18n.language === value,
                })}
                title={t(`language.${value}`) ?? ''}
                href="#"
                onClick={(event) => handleClick(event, value, closeHandler)}
            >
                {t(`language.${value}`)}
            </a>
        </li>
    )
}

export const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation()

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, lng: Languages, closeHandler: () => void) => {
        document.documentElement.setAttribute('lang', lng)
        localStorage.setItem(LANGUAGE_STORE_KEY, lng)
        event.preventDefault()
        i18n.changeLanguage(lng)
        closeHandler()
    }

    return (
        <div className={classnames({ 'idsk-header-web__brand-language': true })}>
            <ButtonPopup
                customTrigger={({ isExpanded }) => (
                    <button
                        className={classnames({
                            'idsk-header-web__brand-language-button': true,
                            'idsk-header-web__brand-language--active': isExpanded,
                        })}
                        aria-label={isExpanded ? t('languageSelector.close') ?? '' : t('languageSelector.open') ?? ''}
                    >
                        {t(`language.${i18n.language}`)}
                        <span className={classnames('idsk-header-web__link-arrow')} />
                    </button>
                )}
                contentClassNameReplacement="idsk-header-web__brand-language--active"
                popupContent={(closePopup) => (
                    <ul className="idsk-header-web__brand-language-list">
                        <LanguageItem handleClick={handleClick} value={Languages.ENGLISH} closeHandler={closePopup} />
                        <LanguageItem handleClick={handleClick} value={Languages.SLOVAK} closeHandler={closePopup} />
                        {import.meta.env.VITE_LOCALES_SHOW_KEYS == 'true' && (
                            <LanguageItem handleClick={handleClick} value={Languages.CI_MODE} closeHandler={closePopup} />
                        )}
                    </ul>
                )}
            />
        </div>
    )
}

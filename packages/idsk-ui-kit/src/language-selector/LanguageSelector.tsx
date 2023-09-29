import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { Languages } from '@isdd/metais-common/localization/languages'
interface ILanguageItem {
    handleClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, lng: Languages) => void
    value: Languages
}

export const LanguageItem: React.FC<ILanguageItem> = ({ handleClick, value }) => {
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
                onClick={(event) => handleClick(event, value)}
                lang={value}
            >
                {t(`language.${value}`)}
            </a>
        </li>
    )
}

export const LanguageSelector: React.FC = () => {
    const { i18n, t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, lng: Languages) => {
        document.documentElement.setAttribute('lang', lng)
        event.preventDefault()
        setIsMenuExpanded(false)
        i18n.changeLanguage(lng, () => navigate(window.location, { state: { from: location } }))
    }

    const handleWrapperBlur = (event: React.FocusEvent<HTMLDivElement, Element>) => {
        /*
        https://developer.mozilla.org/en-US/docs/Web/API/Event/Comparison_of_Event_Targets
        `target` is the element that lost focus,
        `relatedTarget` is the element that gained focus (if applicable),
        `currentTarget` is the element to which the event listener is attached.
        */
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsMenuExpanded(false)
        }
    }

    const handleWrapperKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.code == 'Escape') {
            setIsMenuExpanded(false)
        }
    }

    return (
        <div
            className={classnames({ 'idsk-header-web__brand-language': true, 'idsk-header-web__brand-language--active': isMenuExpanded })}
            onBlur={handleWrapperBlur}
            onKeyDown={handleWrapperKeyDown}
        >
            <button
                className="idsk-header-web__brand-language-button"
                aria-label={isMenuExpanded ? t('languageSelector.close') ?? '' : t('languageSelector.open') ?? ''}
                aria-expanded={isMenuExpanded}
                data-text-for-hide={t('languageSelector.close') ?? ''}
                data-text-for-show={t('languageSelector.open') ?? ''}
                onClick={() => setIsMenuExpanded((x) => !x)}
            >
                {t(`language.${i18n.language}`)}
                <span className="idsk-header-web__link-arrow" />
            </button>
            {isMenuExpanded && (
                <ul className="idsk-header-web__brand-language-list">
                    <LanguageItem handleClick={handleClick} value={Languages.ENGLISH} />
                    <LanguageItem handleClick={handleClick} value={Languages.SLOVAK} />
                </ul>
            )}
        </div>
    )
}

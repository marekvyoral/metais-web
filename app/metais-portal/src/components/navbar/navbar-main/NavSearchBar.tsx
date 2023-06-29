import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@/components/navbar/navbar.module.scss'

export const NavSearchBar = () => {
    const { t } = useTranslation()
    return (
        <form className={classnames('idsk-header-web__main-action-search', styles.fullWidth)}>
            <input
                className="govuk-input govuk-!-display-inline-block"
                id="idsk-header-web__main-action-search-input"
                name="search"
                placeholder={t('navbar.searchPlaceholder')}
                title={t('navbar.searchPlaceholder')}
                type="search"
                aria-label={t('navbar.searchPlaceholder')}
            />
            <button type="submit" className="govuk-button" data-module="govuk-button">
                <span className="govuk-visually-hidden">{t('navbar.search')}</span>
                <i aria-hidden="true" className="fas fa-search" />
            </button>
        </form>
    )
}

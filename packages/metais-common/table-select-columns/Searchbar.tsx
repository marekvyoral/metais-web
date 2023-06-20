import React, { useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

interface ISearchbarProps {
    className?: string
    onSearchButtonClick?: () => void
    onChange: (value: string) => void
}

export const Searchbar: React.FC<ISearchbarProps> = ({ className, onSearchButtonClick, onChange }) => {
    const { t } = useTranslation()
    const [search, setSearch] = useState('')
    return (
        <>
            <div className={classnames('idsk-header-web__main-action-search', className)}>
                <input
                    className="govuk-input govuk-!-display-inline-block"
                    placeholder={t('tableSelectColumns.searchPlaceholder')}
                    title={t('tableSelectColumns.searchPlaceholder')}
                    type="search"
                    aria-label={t('tableSelectColumns.searchPlaceholder')}
                    value={search}
                    onChange={(event) => {
                        onChange(event.target.value)
                        setSearch(event.target.value)
                    }}
                />
                <button className="govuk-button" onClick={onSearchButtonClick}>
                    <span className="govuk-visually-hidden">{t('tableSelectColumns.search')}</span>
                    <i aria-hidden="true" className="fas fa-search" />
                </button>
            </div>
        </>
    )
}

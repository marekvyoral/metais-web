import classNames from 'classnames'
import React, { forwardRef, DetailedHTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './searchInput.module.scss'
interface IInputProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    name: string
    hint?: string
    error?: FieldError
    disabled?: boolean
    onSearchButtonClick?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, IInputProps>(
    ({ id, placeholder, className, style, onSearchButtonClick, name, hint, error, disabled, ...rest }, ref) => {
        const hintId = `${id}-hint`
        const { t } = useTranslation()
        return (
            <div className={classNames('idsk-header-web__main-action-search', styles.searchInputWrapper, className)} style={style}>
                <input
                    className={classNames('govuk-input govuk-!-display-inline-block', styles.searchInput, { 'govuk-input--error': !!error })}
                    title={placeholder || t('searchInput.search').toString()}
                    type="search"
                    aria-label={placeholder || t('searchInput.search').toString()}
                    id={id}
                    name={name}
                    placeholder={placeholder || t('searchInput.search').toString()}
                    ref={ref}
                    {...rest}
                    aria-describedby={hint ? hintId : undefined}
                    disabled={disabled}
                />
                <button className="govuk-button" onClick={onSearchButtonClick} type="submit">
                    <span className="govuk-visually-hidden">{t('searchInput.search')}</span>
                    <i aria-hidden="true" className="fas fa-search" />
                </button>
            </div>
        )
    },
)

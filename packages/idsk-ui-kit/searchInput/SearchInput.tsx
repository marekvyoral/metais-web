import classNames from 'classnames'
import React, { forwardRef, DetailedHTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
            <div className={classNames('idsk-header-web__main-action-search', className)} style={style}>
                <input
                    className={classNames('govuk-input govuk-!-display-inline-block', { 'govuk-input--error': !!error })}
                    title={placeholder}
                    type="search"
                    aria-label={placeholder}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    ref={ref}
                    {...rest}
                    aria-describedby={hint ? hintId : undefined}
                    disabled={disabled}
                />
                <button className="govuk-button" onClick={onSearchButtonClick}>
                    <span className="govuk-visually-hidden">{t('tableSelectColumns.search')}</span>
                    <i aria-hidden="true" className="fas fa-search" />
                </button>
            </div>
        )
    },
)

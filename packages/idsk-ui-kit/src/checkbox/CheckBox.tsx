import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'
import { decodeHtmlEntities } from '@isdd/metais-common/src/utils/utils'
import { useTranslation } from 'react-i18next'

import styles from './checkbox.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface ICheckBoxProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id: string
    label: string | React.ReactNode
    name: string
    value?: string
    disabled?: boolean
    labelClassName?: string
    containerClassName?: string
    error?: string
    info?: string
    title?: string
    htmlForDisabled?: boolean
}

export const CheckBox = forwardRef<HTMLInputElement, ICheckBoxProps>(
    (
        { id, label, error, name, disabled, value, info, title, labelClassName, containerClassName, className, htmlForDisabled = false, ...rest },
        ref,
    ) => {
        const { t } = useTranslation()
        const errorId = `${id}-error`
        return (
            <div className={classNames({ 'govuk-form-group--error': !!error })}>
                <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                    {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                    {error}
                </span>
                <div className={classNames('govuk-checkboxes__item', containerClassName)}>
                    <div className={styles.checkboxWrap}>
                        <input
                            className={classNames('govuk-checkboxes__input', className)}
                            id={id}
                            name={name}
                            type="checkbox"
                            value={value}
                            disabled={disabled}
                            ref={ref}
                            {...rest}
                            title={title}
                            aria-invalid={!!error}
                            aria-describedby={errorId}
                            aria-errormessage={errorId}
                        />

                        {label ? (
                            <label className={classNames('govuk-label govuk-checkboxes__label', labelClassName)} htmlFor={htmlForDisabled ? '' : id}>
                                {label}
                            </label>
                        ) : (
                            <span className={classNames('govuk-label govuk-checkboxes__label', labelClassName)}>{label}</span>
                        )}
                        {info && (
                            <Tooltip
                                descriptionElement={<div className="tooltipWidth500">{decodeHtmlEntities(info)}</div>}
                                altText={`Tooltip ${label}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    },
)

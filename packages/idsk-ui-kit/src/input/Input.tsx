import classNames from 'classnames'
import React, { forwardRef, DetailedHTMLProps } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { useTranslation } from 'react-i18next'
import { decodeHtmlEntities } from '@isdd/metais-common/src/utils/utils'

import styles from './input.module.scss'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IInputProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string
    label?: string
    name: string
    hint?: string
    error?: string
    disabled?: boolean
    info?: string
    correct?: boolean
    className?: string
    inputClassName?: string
    isUpload?: boolean
    hasInputIcon?: boolean
    maxLength?: number
}
export const Input = forwardRef<HTMLInputElement, IInputProps>(
    (
        {
            id = `input_${uuidV4()}`,
            label,
            name,
            hint,
            error,
            disabled,
            info,
            type = 'text',
            correct,
            required,
            className,
            isUpload = false,
            hasInputIcon = false,
            inputClassName,
            maxLength = 255,
            ...rest
        },
        ref,
    ) => {
        const { t } = useTranslation()
        const hintId = `${id}-hint`
        const errorId = `${id}-error`
        const dateProps = type == 'date' ? { max: '9999-12-31' } : {}
        return (
            <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id} lang="sk">
                        {label} {required && t('input.requiredField')}
                    </label>
                    {info && (
                        <Tooltip
                            id={id}
                            altText={`Tooltip ${label}`}
                            descriptionElement={<div className="tooltipWidth500">{decodeHtmlEntities(info)}</div>}
                        />
                    )}
                </div>

                <span id={hintId} className={classNames({ 'govuk-visually-hidden': !hint, 'govuk-hint': !!hint })}>
                    {hint}
                </span>

                <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                    {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                    {error}
                </span>

                <div className={classNames(styles.inputWrapper, inputClassName)} style={{ position: 'relative' }}>
                    <input
                        className={classNames({ 'govuk-input--error': !!error, 'govuk-input': !isUpload, 'govuk-file-upload': isUpload })}
                        id={id}
                        name={name}
                        type={type}
                        ref={ref}
                        {...rest}
                        {...dateProps}
                        aria-invalid={!!error}
                        aria-describedby={`${hintId} ${errorId}`}
                        aria-errormessage={errorId}
                        disabled={disabled}
                        maxLength={maxLength}
                        required={required}
                    />
                    {correct && (
                        <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />
                    )}
                </div>
            </div>
        )
    },
)

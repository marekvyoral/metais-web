import classNames from 'classnames'
import * as React from 'react'
import { forwardRef } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { useTranslation } from 'react-i18next'

import styles from './input.module.scss'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
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
        const dateProps = type == 'date' ? { max: '9999-12-31' } : {}
        return (
            <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id}>
                        {label} {required && t('input.requiredField')}
                    </label>
                    {info && <Tooltip altText={`Tooltip ${label}`} descriptionElement={<div className="tooltipWidth500">{info}</div>} />}
                </div>

                {hint && (
                    <span className="govuk-hint" id={hintId}>
                        {hint}
                    </span>
                )}
                {error && (
                    <>
                        <span className="govuk-error-message">{error}</span>
                    </>
                )}
                <div className={classNames(styles.inputWrapper, inputClassName)} style={{ position: 'relative' }}>
                    <input
                        className={classNames({ 'govuk-input--error': !!error, 'govuk-input': !isUpload, 'govuk-file-upload': isUpload })}
                        id={id}
                        name={name}
                        type={type}
                        ref={ref}
                        {...rest}
                        {...dateProps}
                        aria-describedby={hint ? hintId : undefined}
                        disabled={disabled}
                        maxLength={maxLength}
                    />
                    {correct && <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} />}
                </div>
            </div>
        )
    },
)

import classNames from 'classnames'
import * as React from 'react'
import { forwardRef } from 'react'
import { v4 as uuidV4 } from 'uuid'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import styles from '@isdd/idsk-ui-kit/styles/InfoAndCheckInput.module.scss'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string
    label?: string
    name: string
    hint?: string
    error?: string
    disabled?: boolean
    type?: string
    info?: string
    correct?: boolean
    className?: string
    isUpload?: boolean
    hasInputIcon?: boolean
}
export const Input = forwardRef<HTMLInputElement, IInputProps>(
    ({ id, label, name, hint, error, disabled, info, type = 'text', correct, className, isUpload = false, hasInputIcon = false, ...rest }, ref) => {
        const inputId = id ?? `input_${uuidV4()}`
        const hintId = `${inputId}-hint`
        return (
            <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id}>
                        {label}
                    </label>
                    {info && <Tooltip description={info} />}
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
                <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                    <input
                        className={classNames({ 'govuk-input--error': !!error, 'govuk-input': !isUpload, 'govuk-file-upload': isUpload })}
                        id={inputId}
                        name={name}
                        type={type}
                        ref={ref}
                        {...rest}
                        aria-describedby={hint ? hintId : undefined}
                        disabled={disabled}
                    />
                    {correct && <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} />}
                </div>
            </div>
        )
    },
)

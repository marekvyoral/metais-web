import classNames from 'classnames'
import * as React from 'react'
import { forwardRef } from 'react'

import styles from '../styles/InfoAndCheckInput.module.scss'
import { InfoInputIcon } from '../info-input-icon/InfoInputIcon'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    id?: string
    label?: string
    name: string
    rows: number
    hint?: string
    error?: string
    disabled?: boolean
    info?: string
    correct?: boolean
    wrapperClassname?: string
    hasInputIcon?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, IInputProps>(
    ({ id, label, name, rows, hint, info, error, disabled, correct, wrapperClassname, hasInputIcon = false, ...rest }, ref) => {
        const hintId = `${id}-hint`
        return (
            <div className={classNames('govuk-form-group', wrapperClassname, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id}>
                        {label}
                    </label>
                    {info && <InfoInputIcon description={info} id={id ?? ''} />}
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
                <div className={styles.inputWrapper}>
                    <textarea
                        className={classNames('govuk-textarea', { ' govuk-textarea--error': !!error })}
                        id={id}
                        name={name}
                        rows={rows}
                        ref={ref}
                        {...rest}
                        disabled={disabled}
                    />
                    {correct && <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} />}
                </div>
            </div>
        )
    },
)

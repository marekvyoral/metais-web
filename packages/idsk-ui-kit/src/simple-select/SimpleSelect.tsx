import classNames from 'classnames'
import React, { DetailedHTMLProps, forwardRef } from 'react'

import { InfoInputIcon } from '../info-input-icon/InfoInputIcon'
import { GreenCheckMarkIcon } from '../assets/images'
import styles from '../styles/InfoAndCheckInput.module.scss'

interface SelectProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    id: string
    label: string
    options: { value: string; label: string; disabled?: boolean }[]
    disabled?: boolean
    error?: string
    info?: string
    correct?: boolean
    hasInputIcon?: boolean
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SelectProps>(
    ({ id, label, options, disabled = false, className, error, info, correct, hasInputIcon = false, ...rest }, ref) => {
        return (
            <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
                <div className={styles.labelDiv}>
                    <label className="govuk-label" htmlFor={id}>
                        {label}
                    </label>
                    {info && <InfoInputIcon description={info} id={id} />}
                </div>
                {error && (
                    <>
                        <span className="govuk-error-message">{error}</span>
                    </>
                )}
                <div className={styles.inputWrapper}>
                    <select className={classNames('govuk-select', styles.fullWidth)} id={id} ref={ref} {...rest} disabled={disabled}>
                        {rest.placeholder ? (
                            <option disabled value="">
                                {rest.placeholder}
                            </option>
                        ) : null}
                        {options.map((item) => (
                            <option value={item.value} key={item.value} disabled={item.disabled}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    {correct && <img src={GreenCheckMarkIcon} className={hasInputIcon ? styles.isCorrectWithIcon : styles.isCorrect} />}
                </div>
            </div>
        )
    },
)

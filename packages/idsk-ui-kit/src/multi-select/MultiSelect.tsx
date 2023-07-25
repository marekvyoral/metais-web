import React from 'react'
import classNames from 'classnames'
import { Controller } from 'react-hook-form'
import Select, { MultiValue } from 'react-select'

import { Control, Menu, Option, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import styles from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'

interface IOptions {
    value: string
    label: string
    disabled?: boolean | undefined
}

interface ISelectProps<T extends IOptions> {
    id: string
    label: string
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: any
    options: MultiValue<T>
    onChange?: (newValue: MultiValue<T>) => void
    values?: MultiValue<T>
    rules?: Record<string, string>
}

export const MultiSelect = <T extends IOptions>({ label, control, name, options, values, onChange, rules, id }: ISelectProps<T>): JSX.Element => {
    return (
        <div className="govuk-form-group">
            <label className="govuk-label">{label}</label>
            {control ? (
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState?.error && <span className="govuk-error-message">{fieldState.error.message}</span>}
                            <Select
                                id={id}
                                className={classNames('govuk-select', styles.selectLazyLoading)}
                                components={{ Option, Menu, Control }}
                                options={options}
                                styles={selectStyles<T>()}
                                unstyled
                                isMulti
                                {...field}
                                isOptionDisabled={(option) => !!option.disabled}
                            />
                        </>
                    )}
                />
            ) : (
                <Select
                    id={id}
                    className={classNames('govuk-select', styles.selectLazyLoading)}
                    components={{ Option, Menu, Control }}
                    options={options}
                    styles={selectStyles<T>()}
                    unstyled
                    isMulti
                    value={values}
                    onChange={(value) => {
                        onChange && onChange(value)
                    }}
                    isOptionDisabled={(option) => !!option.disabled}
                />
            )}
        </div>
    )
}

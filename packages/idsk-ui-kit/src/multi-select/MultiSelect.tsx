import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Controller } from 'react-hook-form'
import Select, { MultiValue, GroupBase, Props } from 'react-select'

import { Control, Menu, Option, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import styles from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'

interface IOptions {
    value: string | undefined
    label: string | undefined
    disabled?: boolean | undefined
}

interface ISelectProps<T extends IOptions> extends Props<T, true, GroupBase<T>> {
    id?: string
    label: string
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: any
    options: MultiValue<T>
    onChange?: (newValue: MultiValue<T>) => void
    values?: MultiValue<T>
    rules?: Record<string, string>
    error?: string
}

export const MultiSelect = <T extends IOptions>({
    label,
    control,
    name,
    options,
    values,
    onChange,
    rules,
    id,
    error,
    ...rest
}: ISelectProps<T>): JSX.Element => {
    const [selectError, setSelectError] = useState(error)
    useEffect(() => {
        setSelectError(error)
    }, [error])
    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': !!selectError })}>
            <label className="govuk-label">{label}</label>
            {!!selectError && <span className="govuk-error-message">{selectError}</span>}
            {control ? (
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field, fieldState }) => {
                        setSelectError(fieldState.error?.message)
                        return (
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
                                {...rest}
                            />
                        )
                    }}
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
                    {...rest}
                />
            )}
        </div>
    )
}

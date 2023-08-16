import React from 'react'
import classNames from 'classnames'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import Select, { GroupBase, MultiValue, Props } from 'react-select'

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
    options: MultiValue<T>
    onChange?: (newValue: MultiValue<T>) => void
    placeholder?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register?: UseFormRegister<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    defaultValue?: MultiValue<T>
    values?: MultiValue<T>
    error?: string
    className?: string
}

export const MultiSelect = <T extends IOptions>({
    label,
    name,
    options,
    values,
    defaultValue,
    onChange,
    placeholder,
    id,
    error,
    register,
    setValue,
}: ISelectProps<T>): JSX.Element => {
    const handleOnChange = (selectedValue: MultiValue<T>) => {
        onChange ? onChange(selectedValue) : setValue && setValue(name, selectedValue)
    }
    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': !!error })}>
            <label className="govuk-label">{label}</label>
            {!!error && <span className="govuk-error-message">{error}</span>}
            <Select<T, true, GroupBase<T>>
                id={id}
                name={name}
                value={values}
                defaultValue={defaultValue}
                placeholder={placeholder || ''}
                className={classNames('govuk-select', styles.selectLazyLoading)}
                components={{ Option, Menu, Control }}
                options={options}
                styles={selectStyles<T>()}
                unstyled
                isMulti
                isClearable
                isOptionDisabled={(option) => !!option.disabled}
                {...(register && register(name))}
                onChange={handleOnChange}
            />
        </div>
    )
}

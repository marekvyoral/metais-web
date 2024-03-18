import React from 'react'
import { Control, UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { MenuPosition, MultiValue, OptionProps, SingleValue } from 'react-select'

import { IOption, Select } from '@isdd/idsk-ui-kit/select/Select'

interface ISelectProps<T> {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption<T>>
    option?: (props: OptionProps<IOption<T>>) => JSX.Element
    onChange?: (newValue: string[]) => void
    placeholder?: string
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: Control<any>
    defaultValue?: string[]
    value?: string[]
    error?: string
    info?: string
    correct?: boolean
    required?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
}

export const MultiSelect = <T,>({
    label,
    name,
    options,
    option,
    value,
    defaultValue,
    onChange,
    placeholder,
    className,
    id,
    error,
    setValue,
    clearErrors,
    info,
    correct,
    required,
    disabled,
    onBlur,
    isClearable,
    menuPosition,
    control,
}: ISelectProps<T>) => {
    const handleOnChange = (selectedOption: MultiValue<IOption<T>> | SingleValue<IOption<T>>) => {
        const values: string[] = Array.isArray(selectedOption) ? selectedOption?.map((opt) => opt.value) : []
        values.length && clearErrors && clearErrors(name)
        setValue && setValue(name, values)
        onChange && onChange(values)
    }

    const getValues = (val?: string[]) => {
        const results: IOption<T>[] = []
        val?.forEach((optionVal) => {
            const result = options.find((opt) => opt.value === optionVal)
            result && results.push(result)
        })
        return results
    }
    return (
        <Select
            control={control}
            required={required}
            id={id}
            name={name}
            label={label}
            value={value && getValues(value)}
            defaultValue={defaultValue && getValues(defaultValue)}
            placeholder={placeholder || ''}
            className={className}
            error={error}
            info={info}
            correct={correct}
            option={option}
            options={options}
            isMulti
            disabled={disabled}
            onBlur={onBlur}
            isClearable={isClearable}
            menuPosition={menuPosition}
            onChange={handleOnChange}
        />
    )
}

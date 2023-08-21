import React from 'react'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { MultiValue, OptionProps, SingleValue } from 'react-select'

import { IOption, Select } from '@isdd/idsk-ui-kit/select/Select'

interface ISelectProps {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption>
    option?: (props: OptionProps<IOption>) => JSX.Element
    onChange?: (newValue: string[]) => void
    placeholder?: string
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    defaultValue?: string[]
    value?: string[]
    error?: string
    info?: string
    correct?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
}

export const MultiSelect: React.FC<ISelectProps> = ({
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
    disabled,
    onBlur,
    isClearable,
}) => {
    const handleOnChange = (selectedOption: MultiValue<IOption> | SingleValue<IOption>) => {
        const values: string[] = Array.isArray(selectedOption) ? selectedOption?.map((opt) => opt.value) : []
        values.length && clearErrors && clearErrors(name)
        setValue && setValue(name, values)
        onChange && onChange(values)
    }

    const getValues = (val?: string[]) => {
        const results: IOption[] = []
        val?.forEach((optionVal) => {
            const result = options.find((opt) => opt.value === optionVal)
            result && results.push(result)
        })
        return results
    }

    return (
        <Select
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
            onChange={handleOnChange}
        />
    )
}

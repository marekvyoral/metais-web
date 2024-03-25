import React from 'react'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { MenuPosition, MultiValue, OptionProps, SingleValue } from 'react-select'

import { CreatableSelect } from './CreatableSelect'

import { IOption } from '@isdd/idsk-ui-kit/select/Select'

interface ICreatableSelectProps<T> {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption<T>>
    option?: (props: OptionProps<IOption<T>>) => JSX.Element
    onChange?: (newValue?: T) => void
    placeholder?: string
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    defaultValue?: T
    value?: T
    error?: string
    info?: string
    correct?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
    required?: boolean
    tabIndex?: number
}

export const SimpleCreatableSelect = <T,>({
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
    menuPosition,
    required,
    tabIndex,
}: ICreatableSelectProps<T>) => {
    const handleOnChange = (selectedOption: MultiValue<IOption<T>> | SingleValue<IOption<T>>) => {
        const opt: IOption<T> | undefined = Array.isArray(selectedOption) ? selectedOption[0] : selectedOption
        opt && clearErrors && clearErrors(name)
        setValue && setValue(name, opt?.value || '')
        onChange && onChange(opt?.value)
    }

    return (
        <CreatableSelect
            id={id}
            name={name}
            label={label}
            value={value === null ? null : options.find((opt) => opt.value === value)}
            defaultValue={options.find((opt) => opt.value === defaultValue) || null}
            placeholder={placeholder || ''}
            className={className}
            error={error}
            info={info}
            correct={correct}
            option={option}
            options={options}
            isMulti={false}
            disabled={disabled}
            onBlur={onBlur}
            isClearable={isClearable}
            menuPosition={menuPosition}
            onChange={handleOnChange}
            required={required}
            tabIndex={tabIndex}
        />
    )
}
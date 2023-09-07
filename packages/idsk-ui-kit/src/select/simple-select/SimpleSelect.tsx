import React from 'react'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { MenuPosition, MultiValue, OptionProps, SingleValue } from 'react-select'

import { IOption, Select } from '@isdd/idsk-ui-kit/select/Select'

interface ISelectProps {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption>
    option?: (props: OptionProps<IOption>) => JSX.Element
    onChange?: (newValue?: string) => void
    placeholder?: string
    className?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    defaultValue?: string
    value?: string
    error?: string
    info?: string
    correct?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
}

export const SimpleSelect: React.FC<ISelectProps> = ({
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
}) => {
    const handleOnChange = (selectedOption: MultiValue<IOption> | SingleValue<IOption>) => {
        const opt: IOption | undefined = Array.isArray(selectedOption) ? selectedOption[0] : selectedOption
        opt && clearErrors && clearErrors(name)
        setValue && setValue(name, opt?.value || '')
        onChange && onChange(opt?.value || '')
    }

    return (
        <Select
            id={id}
            name={name}
            label={label}
            value={options.find((opt) => opt.value === value)}
            defaultValue={options.find((opt) => opt.value === defaultValue)}
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
        />
    )
}

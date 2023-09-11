import React from 'react'
import classNames from 'classnames'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { GroupBase, MenuPosition, MultiValue, OptionProps, OptionsOrGroups, PropsValue } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'

import styles from './selectLazyLoading.module.scss'

import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'

export interface ILoadOptionsResponse<T> {
    options: T[]
    hasMore: boolean
    additional: {
        page: number
    }
}

export const DEFAULT_LAZY_LOAD_PER_PAGE = 20

export interface ISelectProps<T> {
    id?: string
    value?: T | MultiValue<T> | null
    onChange?: (val: T | MultiValue<T> | null) => void
    label: string
    name: string
    getOptionValue: (item: T) => string
    getOptionLabel: (item: T) => string
    option?: (props: OptionProps<T>) => JSX.Element
    placeholder?: string
    isMulti?: boolean
    error?: string
    defaultValue?: PropsValue<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue?: UseFormSetValue<any>
    loadOptions: (
        searchQuery: string,
        prevOptions: OptionsOrGroups<T, GroupBase<T>>,
        additional: { page: number } | undefined,
    ) => Promise<ILoadOptionsResponse<T>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearErrors?: UseFormClearErrors<any>
    isClearable?: boolean
    menuPosition?: MenuPosition
}

export const SelectLazyLoading = <T,>({
    value,
    onChange,
    label,
    name,
    getOptionValue,
    getOptionLabel,
    defaultValue,
    option,
    placeholder,
    loadOptions,
    isMulti = false,
    error,
    id,
    setValue,
    clearErrors,
    isClearable = true,
    menuPosition = 'fixed',
}: ISelectProps<T>): JSX.Element => {
    const Option = (props: OptionProps<T>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }

    const handleOnChange = (selectedValue: MultiValue<T> | T | null) => {
        if (onChange) {
            onChange(selectedValue)
        } else if (setValue) {
            if (isMulti) {
                if (Array.isArray(selectedValue) && selectedValue.length) {
                    setValue(
                        name,
                        selectedValue.map((val) => getOptionValue(val)),
                    )
                } else {
                    setValue(name, undefined)
                }
            } else {
                const val = selectedValue ? getOptionValue(Array.isArray(selectedValue) ? selectedValue[0] : selectedValue) : undefined
                setValue(name, val)
            }
        }
        const val = Array.isArray(selectedValue) ? selectedValue.length : selectedValue
        val && clearErrors && clearErrors(name)
    }

    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': !!error })}>
            <label className="govuk-label">{label}</label>
            {!!error && <span className="govuk-error-message">{error}</span>}
            <AsyncPaginate<T, GroupBase<T>, { page: number } | undefined, boolean>
                id={id}
                name={name}
                value={value}
                loadOptions={loadOptions}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                classNames={{ menuList: () => styles.reactSelectMenuList }}
                placeholder={placeholder || ''}
                components={{ Option, Menu, Control }}
                isMulti={isMulti}
                menuPosition={menuPosition}
                defaultValue={defaultValue}
                className={classNames('govuk-select', styles.selectLazyLoading)}
                styles={selectStyles<T>()}
                openMenuOnFocus
                isClearable={isClearable}
                unstyled
                onChange={handleOnChange}
            />
        </div>
    )
}

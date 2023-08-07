import React, { useEffect, useState } from 'react'
import { GroupBase, MultiValue, OptionProps, OptionsOrGroups, components } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import classNames from 'classnames'
import { Controller } from 'react-hook-form'

import styles from './selectLazyLoading.module.scss'

import { Control, Menu, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'

export interface ILoadOptionsResponse<T> {
    options: T[]
    hasMore: boolean
    additional: {
        page: number
    }
}

interface ISelectProps<T> {
    id?: string
    value?: T | MultiValue<T> | null
    onChange?: (val: T | MultiValue<T> | null) => void
    label: string
    name: string
    getOptionValue: (item: T) => string
    getOptionLabel: (item: T) => string
    option?: (props: OptionProps<T>) => JSX.Element
    rules?: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: any
    placeholder?: string
    isMulti?: boolean
    error?: string
    loadOptions: (
        searchQuery: string,
        prevOptions: OptionsOrGroups<T, GroupBase<T>>,
        additional: { page: number } | undefined,
    ) => Promise<ILoadOptionsResponse<T>>
}

export const SelectLazyLoading = <T,>({
    value,
    onChange,
    label,
    name,
    getOptionValue,
    getOptionLabel,
    option,
    placeholder,
    isMulti = false,
    loadOptions,
    error,
    rules,
    control,
    id,
}: ISelectProps<T>): JSX.Element => {
    const Option = (props: OptionProps<T>) => {
        return option ? option(props) : <components.Option {...props} className={styles.selectOption} />
    }
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
                            <AsyncPaginate
                                id={id}
                                loadOptions={loadOptions}
                                getOptionValue={getOptionValue}
                                getOptionLabel={getOptionLabel}
                                placeholder={placeholder || ''}
                                components={{ Option, Menu, Control }}
                                isMulti={isMulti}
                                className={classNames('govuk-select', styles.selectLazyLoading)}
                                styles={selectStyles<T>()}
                                openMenuOnFocus
                                isClearable
                                unstyled
                                {...field}
                            />
                        )
                    }}
                />
            ) : (
                <AsyncPaginate
                    id={id}
                    value={value}
                    loadOptions={loadOptions}
                    onChange={onChange}
                    getOptionValue={getOptionValue}
                    getOptionLabel={getOptionLabel}
                    placeholder={placeholder || ''}
                    components={{ Option, Menu, Control }}
                    isMulti={isMulti}
                    className={classNames('govuk-select', styles.selectLazyLoading)}
                    styles={selectStyles<T>()}
                    name={name}
                    isClearable
                    openMenuOnFocus
                    unstyled
                />
            )}
        </div>
    )
}

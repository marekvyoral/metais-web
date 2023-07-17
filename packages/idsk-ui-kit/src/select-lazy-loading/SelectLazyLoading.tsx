import React from 'react'
import { GroupBase, MultiValue, OptionProps, OptionsOrGroups, components } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import classNames from 'classnames'

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
    value: T | MultiValue<T> | null
    onChange: (val: T | MultiValue<T> | null) => void
    label: string
    name: string
    getOptionValue: (item: T) => string
    getOptionLabel: (item: T) => string
    option?: (props: OptionProps<T>) => JSX.Element
    placeholder?: string
    isMulti?: boolean
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
}: ISelectProps<T>): JSX.Element => {
    const Option = (props: OptionProps<T>) => {
        return option ? option(props) : <components.Option {...props} className={styles.selectOption} />
    }

    return (
        <div className="govuk-form-group">
            <label className="govuk-label">{label}</label>
            <AsyncPaginate
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
                id={name}
                openMenuOnFocus
                unstyled
            />
        </div>
    )
}

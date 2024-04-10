import React, { ReactElement } from 'react'
import classNames from 'classnames'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { GroupBase, MenuPosition, MultiValue, OptionProps, OptionsOrGroups, PropsValue } from 'react-select'
import { useTranslation } from 'react-i18next'
import { PopupPosition } from 'reactjs-popup/dist/types'
import Creatable, { CreatableProps } from 'react-select/creatable'
import { ComponentProps, UseAsyncPaginateParams, withAsyncPaginate } from 'react-select-async-paginate'

import styles from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'
import { Control, Menu, getMultiValueRemove, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { useGetLocalMessages } from '@isdd/idsk-ui-kit/select/useGetLocalMessages'
import { ILoadOptionsResponse } from '@isdd/idsk-ui-kit/select-lazy-loading/SelectLazyLoading'

type AsyncPaginateCreatableProps<OptionType, Group extends GroupBase<OptionType>, Additional, IsMulti extends boolean> = CreatableProps<
    OptionType,
    IsMulti,
    Group
> &
    UseAsyncPaginateParams<OptionType, Group, Additional> &
    ComponentProps<OptionType, Group, IsMulti>

type AsyncPaginateCreatableType = <OptionType, Group extends GroupBase<OptionType>, Additional, IsMulti extends boolean = false>(
    props: AsyncPaginateCreatableProps<OptionType, Group, Additional, IsMulti>,
) => ReactElement

export const CreatableAsyncPaginate = withAsyncPaginate(Creatable) as AsyncPaginateCreatableType

export interface ISelectProps<T> {
    id?: string
    value?: T | MultiValue<T> | null
    onChange?: (val: T | MultiValue<T> | null) => void
    label: string
    info?: string
    name: string
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
    disabled?: boolean
    required?: boolean
    tooltipPosition?: PopupPosition | PopupPosition[]
    hint?: string
}

export const CreatableLazySelect = <T,>({
    value,
    onChange,
    label,
    name,
    info,
    getOptionLabel,
    defaultValue,
    option,
    placeholder,
    loadOptions,
    isMulti = false,
    error,
    id,
    isClearable = true,
    menuPosition = 'fixed',
    disabled,
    required,
    hint,
    tooltipPosition,
}: ISelectProps<T>): JSX.Element => {
    const { t } = useTranslation()
    const errorId = `${id}-error`
    const hintId = `${id}-hint`

    const localMessages = useGetLocalMessages()
    const Option = (props: OptionProps<T>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }

    return (
        <div className={classNames('govuk-form-group', { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label" htmlFor={id}>
                    {label} {required && t('input.requiredField')}
                </label>
                {info && <Tooltip descriptionElement={info} position={tooltipPosition} altText={`Tooltip ${label}`} />}
            </div>
            <span id={hintId} className={classNames({ 'govuk-visually-hidden': !hint, 'govuk-hint': !!hint })}>
                {hint}
            </span>
            <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                {error}
            </span>
            <CreatableAsyncPaginate<T, GroupBase<T>, { page: number } | undefined, boolean>
                id={id}
                name={name}
                value={value}
                loadOptions={loadOptions}
                getOptionLabel={getOptionLabel}
                classNames={{ menuList: () => styles.reactSelectMenuList }}
                placeholder={placeholder || ''}
                components={{ Option, Menu, Control, MultiValueRemove: getMultiValueRemove(t) }}
                isMulti={isMulti}
                menuPosition={menuPosition}
                defaultValue={defaultValue}
                className={classNames('govuk-select', styles.selectLazyLoading)}
                styles={selectStyles<T>()}
                openMenuOnFocus
                isClearable={isClearable}
                unstyled
                onChange={onChange}
                isDisabled={disabled}
                aria-invalid={!!error}
                aria-describedby={errorId}
                aria-errormessage={errorId}
                noOptionsMessage={localMessages.noOptionsMessage}
                ariaLiveMessages={localMessages.ariaLiveMessages}
                screenReaderStatus={localMessages.screenReaderStatus}
                loadingMessage={localMessages.loadingMessage}
                required={required}
                allowCreateWhileLoading
                formatCreateLabel={(inputValue: string) => t('creatableSelect.createNew', { input: inputValue })}
            />
        </div>
    )
}

import { GreenCheckMarkIcon } from '@isdd/metais-common/src/assets/images'
import classNames from 'classnames'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiValue, OptionProps, SingleValue, MenuPosition, GroupBase } from 'react-select'
import Creatable from 'react-select/creatable'

import { Tooltip } from '@/tooltip/Tooltip'
import { useGetLocalMessages } from '@isdd/idsk-ui-kit/select/useGetLocalMessages'
import styles from '@isdd/idsk-ui-kit/select/select.module.scss'
import { Option as ReactSelectDefaultOptionComponent, getMultiValueRemove, selectStyles, Control, Menu } from '@isdd/idsk-ui-kit/common/SelectCommon'

export interface IOption<T> {
    value: T
    label: string | ReactElement
    disabled?: boolean
}

interface ICreatableSelectProps<T> {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption<T>>
    option?: (props: OptionProps<IOption<T>>) => JSX.Element
    onChange: (newValue: MultiValue<IOption<T>> | SingleValue<IOption<T>>) => void
    placeholder?: string
    className?: string
    defaultValue?: IOption<T> | IOption<T>[] | null
    value?: IOption<T> | IOption<T>[] | null
    error?: string
    info?: string
    correct?: boolean
    isMulti?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
    required?: boolean
    tabIndex?: number
}

export const CreatableSelect = <T,>({
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
    info,
    correct,
    isMulti,
    disabled,
    onBlur,
    isClearable = true,
    menuPosition = 'fixed',
    required,
    tabIndex,
}: ICreatableSelectProps<T>) => {
    const Option = (props: OptionProps<IOption<T>>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }
    const { t } = useTranslation()
    const localMessages = useGetLocalMessages()

    const errorId = `${id}-error`
    return (
        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label" htmlFor={id}>
                    {label} {required && t('input.requiredField')}
                </label>
                {info && <Tooltip descriptionElement={info} altText={`Tooltip ${label}`} />}
            </div>
            <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                {error}
            </span>
            <div className={styles.inputWrapper}>
                <Creatable<IOption<T>, boolean, GroupBase<IOption<T>>>
                    inputId={id}
                    aria-label={label}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ''}
                    className={classNames('govuk-select', styles.reactSelect)}
                    classNames={{ menuList: () => styles.reactSelectMenuList }}
                    components={{ Option, Menu, Control, MultiValueRemove: getMultiValueRemove(t) }}
                    options={options}
                    styles={selectStyles<IOption<T>>()}
                    unstyled
                    menuPosition={menuPosition}
                    isDisabled={disabled}
                    isMulti={isMulti}
                    onBlur={onBlur}
                    isClearable={isClearable}
                    isOptionDisabled={(opt) => !!opt.disabled}
                    onChange={onChange}
                    aria-invalid={!!error}
                    aria-describedby={errorId}
                    aria-errormessage={errorId}
                    noOptionsMessage={localMessages.noOptionsMessage}
                    ariaLiveMessages={localMessages.ariaLiveMessages}
                    screenReaderStatus={localMessages.screenReaderStatus}
                    loadingMessage={localMessages.loadingMessage}
                    tabIndex={tabIndex}
                    required={required}
                    allowCreateWhileLoading
                    formatCreateLabel={(inputValue: string) => t('creatableSelect.createNew', { input: inputValue })}
                />
                {correct && <img src={GreenCheckMarkIcon} className={isClearable ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />}
            </div>
        </div>
    )
}
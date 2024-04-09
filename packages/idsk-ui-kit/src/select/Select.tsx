import classNames from 'classnames'
import React, { ReactElement, useId } from 'react'
import ReactSelect, { GroupBase, MenuPosition, MultiValue, OptionProps, SingleValue } from 'react-select'
import { useTranslation } from 'react-i18next'
import { Controller, Control as ControlReactForm } from 'react-hook-form'
import sanitizeHtml from 'sanitize-html'
import { decodeHtmlEntities } from '@isdd/metais-common/src/utils/utils'

import styles from './select.module.scss'
import { useGetLocalMessages } from './useGetLocalMessages'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles, getMultiValueRemove } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

export interface IOption<T> {
    value: T
    label: string | ReactElement
    disabled?: boolean
}

interface ISelectProps<T> {
    id?: string
    label: string
    ariaLabel?: string
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
    isSearchable?: boolean
    isClearable?: boolean
    menuPosition?: MenuPosition
    required?: boolean
    tabIndex?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: ControlReactForm<any>
}

export const Select = <T,>({
    label,
    ariaLabel,
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
    isSearchable = true,
    menuPosition = 'fixed',
    required,
    tabIndex,
    control,
}: ISelectProps<T>) => {
    const Option = (props: OptionProps<IOption<T>>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }
    const { t } = useTranslation()
    const localMessages = useGetLocalMessages()

    const uniqueId = useId()
    const inputId = id ?? uniqueId
    const errorId = `${id}-error`
    return (
        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label" htmlFor={inputId}>
                    {label} {required && t('input.requiredField')}
                </label>
                {info && (
                    <Tooltip
                        descriptionElement={
                            <div className="tooltipWidth500">
                                {
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(decodeHtmlEntities(info)),
                                        }}
                                    />
                                }
                            </div>
                        }
                        altText={`Tooltip ${label}`}
                    />
                )}
            </div>
            <span id={errorId} className={classNames({ 'govuk-visually-hidden': !error, 'govuk-error-message': !!error })}>
                {error && <span className="govuk-visually-hidden">{t('error')}</span>}
                {error}
            </span>
            <div className={styles.inputWrapper}>
                {control ? (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field: { ref } }) => (
                            <ReactSelect<IOption<T>, boolean, GroupBase<IOption<T>>>
                                ref={ref}
                                inputId={inputId}
                                name={name}
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
                                isSearchable={isSearchable}
                                isOptionDisabled={(opt) => !!opt.disabled}
                                onChange={onChange}
                                aria-label={ariaLabel}
                                aria-invalid={!!error}
                                aria-describedby={errorId}
                                aria-errormessage={errorId}
                                noOptionsMessage={localMessages.noOptionsMessage}
                                ariaLiveMessages={localMessages.ariaLiveMessages}
                                screenReaderStatus={localMessages.screenReaderStatus}
                                loadingMessage={localMessages.loadingMessage}
                                tabIndex={tabIndex}
                                required={required}
                            />
                        )}
                    />
                ) : (
                    <ReactSelect<IOption<T>, boolean, GroupBase<IOption<T>>>
                        inputId={inputId}
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
                        isSearchable={isSearchable}
                        isOptionDisabled={(opt) => !!opt.disabled}
                        onChange={onChange}
                        aria-label={ariaLabel}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        aria-errormessage={errorId}
                        noOptionsMessage={localMessages.noOptionsMessage}
                        ariaLiveMessages={localMessages.ariaLiveMessages}
                        screenReaderStatus={localMessages.screenReaderStatus}
                        loadingMessage={localMessages.loadingMessage}
                        tabIndex={tabIndex}
                        required={required}
                    />
                )}
                {correct && <img src={GreenCheckMarkIcon} className={isClearable ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />}
            </div>
        </div>
    )
}

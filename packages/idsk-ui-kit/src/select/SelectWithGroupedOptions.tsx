import classNames from 'classnames'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import ReactSelect, { GroupBase, MenuPosition, OptionProps, OptionsOrGroups, SelectInstance, createFilter } from 'react-select'

import styles from './select.module.scss'
import { IOption } from './Select'
import { useGetLocalMessages } from './useGetLocalMessages'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

export interface GroupedOption {
    label: string | ReactElement
    options?: IOption<string>[]
}

interface ISelectProps {
    id?: string
    label: string
    name: string
    options: OptionsOrGroups<GroupedOption | undefined, GroupBase<GroupedOption | undefined>>
    option?: (props: OptionProps<IOption<string>>) => JSX.Element
    onChange: (newValue: IOption<string>) => void
    placeholder?: string
    className?: string
    defaultValue?: (IOption<string> | undefined)[]
    value?: IOption<string> | IOption<string>[] | null
    error?: string
    info?: string
    correct?: boolean
    isMulti?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
    required?: boolean
    focus?: boolean
}

export const SelectWithGroupedOptions = ({
    label,
    name,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    className,
    id,
    error,
    info,
    correct,
    disabled,
    onBlur,
    isClearable = true,
    menuPosition = 'fixed',
    required,
    focus = false,
}: ISelectProps) => {
    const { t } = useTranslation()
    const localMessages = useGetLocalMessages()

    const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        stringify: (item: IOption<string>) => `${item.label}`,
        trim: true,
    }
    const errorId = `${id}-error`
    const callbackRef = useCallback(
        (inputElement: SelectInstance<GroupedOption | undefined> | null) => {
            if (focus && inputElement) {
                inputElement.focus()
            }
        },
        [focus],
    )

    return (
        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label" htmlFor={id}>
                    {label} {required && t('input.requiredField')}
                </label>
                {info && <Tooltip descriptionElement={info} altText={`Tooltip ${label}`} />}
            </div>
            {!!error && (
                <span id={errorId} className="govuk-error-message">
                    {error}
                </span>
            )}
            <div className={styles.inputWrapper}>
                <ReactSelect<GroupedOption | undefined>
                    id={id}
                    ref={callbackRef}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ''}
                    className={classNames('govuk-select', styles.reactSelect)}
                    classNames={{ menuList: () => styles.reactSelectMenuList }}
                    components={{ Option: ReactSelectDefaultOptionComponent, Menu, Control }}
                    options={options}
                    filterOption={createFilter(filterConfig)}
                    styles={selectStyles()}
                    unstyled
                    menuPosition={menuPosition}
                    isDisabled={disabled}
                    onBlur={onBlur}
                    isClearable={isClearable}
                    onChange={(val) => {
                        onChange(val as IOption<string>)
                    }}
                    aria-errormessage={errorId}
                    noOptionsMessage={localMessages.noOptionsMessage}
                    ariaLiveMessages={localMessages.ariaLiveMessages}
                    screenReaderStatus={localMessages.screenReaderStatus}
                    loadingMessage={localMessages.loadingMessage}
                />
                {correct && <img src={GreenCheckMarkIcon} className={isClearable ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />}
            </div>
        </div>
    )
}

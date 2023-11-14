import classNames from 'classnames'
import React from 'react'
import ReactSelect, { GroupBase, MenuPosition, MultiValue, OptionProps, SingleValue } from 'react-select'
import { useTranslation } from 'react-i18next'

import styles from './select.module.scss'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

export interface IOption<T> {
    value: T
    label: string
    disabled?: boolean
}

interface ISelectProps<T> {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption<T>>
    option?: (props: OptionProps<IOption<T>>) => JSX.Element
    onChange: (newValue: MultiValue<IOption<T>> | SingleValue<IOption<T>>) => void
    placeholder?: string
    className?: string
    defaultValue?: IOption<T> | IOption<T>[]
    value?: IOption<T> | IOption<T>[]
    error?: string
    info?: string
    correct?: boolean
    isMulti?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
    menuPosition?: MenuPosition
    required?: boolean
}

export const Select = <T,>({
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
}: ISelectProps<T>) => {
    const Option = (props: OptionProps<IOption<T>>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }
    const { t } = useTranslation()

    return (
        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label" htmlFor={id}>
                    {label} {required && t('input.requiredField')}
                </label>
                {info && <Tooltip descriptionElement={info} altText={`Tooltip ${label}`} />}
            </div>
            {!!error && <span className="govuk-error-message">{error}</span>}
            <div className={styles.inputWrapper}>
                <ReactSelect<IOption<T>, boolean, GroupBase<IOption<T>>>
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ''}
                    className={classNames('govuk-select', styles.reactSelect)}
                    classNames={{ menuList: () => styles.reactSelectMenuList }}
                    components={{ Option, Menu, Control }}
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
                />
                {correct && <img src={GreenCheckMarkIcon} className={isClearable ? styles.isCorrectWithIcon : styles.isCorrect} />}
            </div>
        </div>
    )
}

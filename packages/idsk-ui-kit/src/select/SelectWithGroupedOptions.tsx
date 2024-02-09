import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactSelect, { GroupBase, MenuPosition, OptionProps, OptionsOrGroups, createFilter } from 'react-select'

import styles from './select.module.scss'
import { IOption } from './Select'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

export interface GroupedOption {
    label: string
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
}: ISelectProps) => {
    const { t } = useTranslation()

    const filterConfig = {
        ignoreCase: true,
        ignoreAccents: true,
        stringify: (item: IOption<string>) => `${item.label}`,
        trim: true,
    }

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
                <ReactSelect<GroupedOption | undefined>
                    id={id}
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
                />
                {correct && <img src={GreenCheckMarkIcon} className={isClearable ? styles.isCorrectWithIcon : styles.isCorrect} alt={t('valid')} />}
            </div>
        </div>
    )
}

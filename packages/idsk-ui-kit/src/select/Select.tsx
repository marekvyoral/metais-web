import classNames from 'classnames'
import React from 'react'
import ReactSelect, { GroupBase, MultiValue, OptionProps, SingleValue } from 'react-select'

import styles from './select.module.scss'

import { GreenCheckMarkIcon } from '@isdd/idsk-ui-kit/assets/images'
import { Control, Menu, Option as ReactSelectDefaultOptionComponent, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

export interface IOption {
    value: string
    label: string
    disabled?: boolean
}

interface ISelectProps {
    id?: string
    label: string
    name: string
    options: MultiValue<IOption>
    option?: (props: OptionProps<IOption>) => JSX.Element
    onChange: (newValue: MultiValue<IOption> | SingleValue<IOption>) => void
    placeholder?: string
    className?: string
    defaultValue?: IOption | IOption[]
    value?: IOption | IOption[]
    error?: string
    info?: string
    correct?: boolean
    isMulti?: boolean
    disabled?: boolean
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    isClearable?: boolean
}

export const Select: React.FC<ISelectProps> = ({
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
}) => {
    const Option = (props: OptionProps<IOption>) => {
        return option ? option(props) : ReactSelectDefaultOptionComponent(props)
    }

    return (
        <div className={classNames('govuk-form-group', className, { 'govuk-form-group--error': !!error })}>
            <div className={styles.labelDiv}>
                <label className="govuk-label">{label}</label>
                {info && <Tooltip description={info} id={id ?? ''} />}
            </div>
            {!!error && <span className="govuk-error-message">{error}</span>}
            <div className={styles.inputWrapper}>
                <ReactSelect<IOption, boolean, GroupBase<IOption>>
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ''}
                    className={classNames('govuk-select', styles.reactSelect)}
                    components={{ Option, Menu, Control }}
                    options={options}
                    styles={selectStyles<IOption>()}
                    unstyled
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

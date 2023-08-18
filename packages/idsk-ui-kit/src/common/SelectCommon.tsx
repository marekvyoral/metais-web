import React from 'react'
import { ControlProps, GroupBase, MenuProps, OptionProps, StylesConfig, components } from 'react-select'

import styles from './selectCommon.module.scss'

export const Menu = <T,>(props: MenuProps<T, boolean, GroupBase<T>>) => {
    return (
        <components.Menu {...props} className={styles.reactMenu}>
            {props.children}
        </components.Menu>
    )
}

export const Option = <T,>(props: OptionProps<T>) => {
    return <components.Option {...props} className={styles.reactSelectOption} />
}

export const Control = <T,>(props: ControlProps<T>) => {
    return <components.Control {...props} className={styles.reactControl} />
}

export const selectStyles = <T,>(): StylesConfig<T, boolean, GroupBase<T>> => ({
    multiValue: (base) => ({ ...base, border: 'solid', borderWidth: '1px', margin: '1px', padding: '2px' }),
    multiValueRemove: (base) => ({
        ...base,
        cursor: 'pointer',
    }),
    indicatorsContainer: (base) => ({
        ...base,
        cursor: 'pointer',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isDisabled ? '#aaaaaa' : provided.color,
    }),
    control: (base, { isDisabled }) => ({
        ...base,
        color: isDisabled ? '#aaaaaa' : base.color,
    }),
})

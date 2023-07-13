import React from 'react'
import { ControlProps, GroupBase, MenuProps, OptionProps, StylesConfig, components } from 'react-select'

import styles from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'

export const Menu = <T,>(props: MenuProps<T, true, GroupBase<T>>) => {
    return (
        <components.Menu {...props} className={styles.menu}>
            {props.children}
        </components.Menu>
    )
}

export const Option = <T,>(props: OptionProps<T>) => {
    return <components.Option {...props} className={styles.selectOption} />
}

export const Control = <T,>(props: ControlProps<T>) => {
    return <components.Control {...props} className={styles.control} />
}

export const selectStyles = <T,>(): StylesConfig<T, true, GroupBase<T>> => ({
    multiValue: (base) => ({ ...base, border: 'solid', borderWidth: '1px', margin: '1px', padding: '2px' }),
    multiValueRemove: (base) => ({
        ...base,
        cursor: 'pointer',
    }),
    indicatorsContainer: (base) => ({
        ...base,
        cursor: 'pointer',
    }),
})

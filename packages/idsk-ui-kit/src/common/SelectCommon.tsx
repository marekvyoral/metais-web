import React from 'react'
import { ControlProps, GroupBase, MenuProps, MultiValueRemoveProps, OptionProps, StylesConfig, components } from 'react-select'
import { TFunction } from 'i18next'

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

export const getMultiValueRemove =
    (t: TFunction<'translation', undefined, 'translation'>) =>
    <T,>(props: MultiValueRemoveProps<T>) => {
        // aria-label "Remove ${label}" is for now hardcoded in the plugin
        // and only way to translate it is like this.
        // This should be checked after new plugin versions are released
        const strippedOptionLabel = props.innerProps?.['aria-label']?.replace(/^(Remove )/, '')
        const propsWithTranslatedLabel = {
            ...props,
            innerProps: { ...props.innerProps, 'aria-label': t('select.removeOption', { label: strippedOptionLabel }) },
        }

        return <components.MultiValueRemove {...propsWithTranslatedLabel}>{props.children || <components.CrossIcon />}</components.MultiValueRemove>
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
    option: (provided, state) => {
        return {
            ...provided,
            color: state.isDisabled ? '#aaaaaa' : provided.color,
            backgroundColor: state.isFocused ? '#DEEBFF' : provided.backgroundColor,
        }
    },
    control: (base, { isDisabled }) => ({
        ...base,
        color: isDisabled ? '#aaaaaa' : base.color,
    }),
    groupHeading: (base) => ({
        ...base,
        fontWeight: 'bold',
        padding: '5px 5px',
    }),
    menuPortal: (base, { rect, offset }) => {
        //our input is smaller with padding; style adjustments required
        const width = `${rect.width + 13}px`
        const left = `${rect.left - 7}px`
        const top = `${offset + 7}px`
        return {
            ...base,
            left,
            top,
            width,
            zIndex: 10,
        }
    },
})

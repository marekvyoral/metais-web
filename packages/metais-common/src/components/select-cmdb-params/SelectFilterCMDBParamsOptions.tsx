import React from 'react'
import { OptionProps, components } from 'react-select'

export interface IOptions {
    label: string
    subLabel?: string
    value: string
}

export const SelectFilterCMDBParamsOption = (props: OptionProps<IOptions>) => {
    return (
        <components.Option {...props} className="select-option">
            <div>{props.data?.label}</div>

            <span>
                <small>{props.data?.subLabel}</small>
            </span>
        </components.Option>
    )
}

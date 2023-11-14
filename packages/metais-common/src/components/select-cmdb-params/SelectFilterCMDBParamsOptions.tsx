import { OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import React from 'react'

export interface IOptions {
    label: string
    subLabel?: string
    value: string
}

export const SelectFilterCMDBParamsOption = (props: OptionProps<IOptions>) => {
    return (
        <Option {...props} className="select-option">
            <div>{props.data?.label}</div>

            <span>
                <small>{props.data?.subLabel}</small>
            </span>
        </Option>
    )
}

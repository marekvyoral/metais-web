import React from 'react'
import classNames from 'classnames'
import Select, { GroupBase, Props } from 'react-select'

import { Option, Menu, Control, selectStyles } from '@isdd/idsk-ui-kit/common/SelectCommon'
import styles from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'

interface ISelectProps {
    label: string
}

export const MultiSelect = <T,>({ label, ...rest }: ISelectProps & Props<T, true, GroupBase<T>>): JSX.Element => {
    return (
        <div className="govuk-form-group">
            <label className="govuk-label">{label}</label>
            <Select
                className={classNames('govuk-select', styles.selectLazyLoading)}
                components={{ Option, Menu, Control }}
                styles={selectStyles<T>()}
                unstyled
                isMulti
                {...rest}
            />
        </div>
    )
}

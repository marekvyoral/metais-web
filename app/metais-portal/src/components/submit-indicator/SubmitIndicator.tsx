import React from 'react'
import classNames from 'classnames'

import styles from './submitIndicator.module.scss'

interface ISubmitIndicatorProps {
    loadingLabel: string
    icon: string
    loadingLabelClassName?: string
}
export const SubmitIndicator: React.FC<ISubmitIndicatorProps> = ({ loadingLabel, icon, loadingLabelClassName }) => {
    return (
        <div className={classNames(styles.loadingBlock, 'govuk-body')}>
            {<img src={icon} />}
            <div className={loadingLabelClassName}>{loadingLabel}</div>
        </div>
    )
}

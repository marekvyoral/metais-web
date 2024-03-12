import React from 'react'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

export interface IIconLabelProps {
    label?: string
    icon: string
    withMargin?: boolean
}
export const IconLabel: React.FC<IIconLabelProps> = ({ label, icon, withMargin }) => {
    return (
        <div className={styles.buttonWithIcon}>
            <img className={withMargin ? styles.iconAddItems : styles.iconWithoutMargin} src={icon} alt="" />
            {label}
        </div>
    )
}

import React from 'react'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

export interface IIconLabelProps {
    label?: string
    icon: string
    alt?: string
}
export const IconLabel: React.FC<IIconLabelProps> = ({ label, icon, alt }) => {
    return (
        <div className={styles.buttonWithIcon}>
            <img className={styles.iconAddItems} src={icon} alt={alt ?? ''} />
            {label}
        </div>
    )
}

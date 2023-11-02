import { TextBody } from '@isdd/idsk-ui-kit'
import React from 'react'

import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

export interface IBulkListProps {
    title: string
    items: ConfigurationItemUi[]
}

export const BulkList: React.FC<IBulkListProps> = ({ title, items }) => {
    return (
        <>
            <TextBody>{title}</TextBody>

            <ul className={styles.list}>
                {Object.entries(items).map(([id, item]) => (
                    <li key={id}>
                        <TextBody size="S">{item.attributes?.Gen_Profil_nazov}</TextBody>
                    </li>
                ))}
            </ul>
        </>
    )
}

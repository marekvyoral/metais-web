import { TextHeading } from '@isdd/idsk-ui-kit'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'
import classNames from 'classnames'
import React from 'react'

interface Props {
    entityItemName: string
    isInvalidated: boolean
}

export const POEntityDetailHeader: React.FC<Props> = ({ entityItemName, isInvalidated }) => {
    return (
        <div className={styles.headerDiv}>
            <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                {entityItemName}
            </TextHeading>
        </div>
    )
}

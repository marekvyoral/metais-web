import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { TextBody } from '@isdd/idsk-ui-kit'

import styles from './definitionList.module.scss'

interface IDefintionListItemProps extends PropsWithChildren {
    label: string | React.ReactNode
    value: string | React.ReactNode
    lang?: string | undefined
}

export const DefinitionListItem: React.FC<IDefintionListItemProps> = ({ label, value, lang }) => {
    return (
        <>
            <dt className={classNames('govuk-label', styles.dt)}>{label}</dt>
            <dd className={styles.dd}>
                <TextBody lang={lang}>{value}</TextBody>
            </dd>
        </>
    )
}

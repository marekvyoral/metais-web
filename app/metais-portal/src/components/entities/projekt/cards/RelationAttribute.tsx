import React, { PropsWithChildren } from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { GridCol } from '@isdd/idsk-ui-kit/grid/GridCol'
import { GridRow } from '@isdd/idsk-ui-kit/grid/GridRow'

import styles from './relationAttribute.module.scss'

interface IAttributeProps extends PropsWithChildren {
    name: string
    value: React.ReactNode
}

export const RelationAttribute: React.FC<IAttributeProps> = ({ name, value }) => {
    return (
        <GridRow className={styles.groupRow}>
            <GridCol setWidth="one-third">
                <TextBody size="S" className={styles.textRow}>
                    <span className="govuk-!-font-weight-bold">{name}</span>
                </TextBody>
            </GridCol>
            <GridCol setWidth="two-thirds">
                <TextBody size="S" className={styles.textRow}>
                    {value}
                </TextBody>
            </GridCol>
        </GridRow>
    )
}

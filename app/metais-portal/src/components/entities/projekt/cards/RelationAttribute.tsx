import React, { PropsWithChildren } from 'react'
import { TextBody } from 'idsk-ui-kit/typography/TextBody'

import styles from './relationAttribute.module.scss'

import { GridCol } from '@/components/grid/GridCol'
import { GridRow } from '@/components/grid/GridRow'

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

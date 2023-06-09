import React, { PropsWithChildren } from 'react'

import styles from './informationGridRow.module.scss'

import { GridCol } from '@/components/grid/GridCol'
import { TextBody } from 'idsk-ui-kit/typography/TextBody'
import { GridRow } from '@/components/grid/GridRow'
import { InfoIconWithText } from 'idsk-ui-kit/typography/InfoIconWithText'

interface IInformationGridRowProps extends PropsWithChildren {
    label: string
    value: React.ReactNode
}

export const InformationGridRow: React.FC<IInformationGridRowProps> = ({ label, value }) => {
    return (
        <GridRow className={styles.groupRow}>
            <GridCol setWidth="one-third">
                <InfoIconWithText>{label}</InfoIconWithText>
            </GridCol>
            <GridCol setWidth="two-thirds">
                <TextBody size="S" className={styles.textRow}>
                    {value}
                </TextBody>
            </GridCol>
        </GridRow>
    )
}

import React, { PropsWithChildren } from 'react'

import styles from './informationGridRow.module.scss'

import { TextBody, InfoIconWithText } from '@metais-web/idsk-ui-kit'
import { GridCol } from '@portal/components/grid/GridCol'
import { GridRow } from '@portal/components/grid/GridRow'

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

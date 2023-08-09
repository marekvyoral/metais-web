import React, { PropsWithChildren } from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/typography/InfoIconWithText'
import { GridCol } from '@isdd/idsk-ui-kit/grid/GridCol'
import { GridRow } from '@isdd/idsk-ui-kit/grid/GridRow'

import styles from './informationGridRow.module.scss'

interface IInformationGridRowProps extends PropsWithChildren {
    label: string
    value: React.ReactNode
    tooltip?: string
    hideIcon?: boolean
}

export const InformationGridRow: React.FC<IInformationGridRowProps> = ({ label, value, tooltip, hideIcon }) => {
    return (
        <GridRow className={styles.groupRow}>
            <GridCol setWidth="one-third">
                <InfoIconWithText tooltip={tooltip} hideIcon={hideIcon}>
                    {label}
                </InfoIconWithText>
            </GridCol>
            <GridCol setWidth="two-thirds">
                <TextBody size="S" className={styles.textRow}>
                    {value}
                </TextBody>
            </GridCol>
        </GridRow>
    )
}

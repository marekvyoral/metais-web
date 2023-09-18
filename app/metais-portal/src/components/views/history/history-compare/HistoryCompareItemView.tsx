import React from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { GridRow } from '@isdd/idsk-ui-kit/grid/GridRow'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/typography/InfoIconWithText'
import { GridCol } from '@isdd/idsk-ui-kit/grid/GridCol'
import classNames from 'classnames'

import styles from './historyCompare.module.scss'

interface IHistoryCompareItemViewProps {
    label: string
    tooltip: string
    valueFirst: string | Array<string>
    valueSec: string | Array<string>
    isSimple?: boolean
}

export const HistoryCompareItemView: React.FC<IHistoryCompareItemViewProps> = ({ label, tooltip, valueFirst, valueSec, isSimple }) => {
    const isDiff = (): boolean => {
        if (Array.isArray(valueFirst) && Array.isArray(valueSec)) {
            if (valueFirst.length !== valueSec.length) {
                return true
            }

            for (let i = 0; i < valueFirst.length; i++) {
                if (valueFirst[i] !== valueSec[i]) {
                    return true
                }
            }
        } else {
            if (valueFirst !== valueSec) {
                return true
            }
        }

        return false
    }
    return (
        <GridRow className={styles.groupRow}>
            <GridCol setWidth="one-third">
                {tooltip ? (
                    <InfoIconWithText tooltip={tooltip} hideIcon={!tooltip}>
                        {label}
                    </InfoIconWithText>
                ) : (
                    <TextBody size="S" className={styles.textRow}>
                        &nbsp;
                        {label}
                    </TextBody>
                )}
            </GridCol>
            <GridCol setWidth={isSimple ? 'two-thirds' : 'one-third'}>
                <TextBody size="S" className={classNames(styles.textRow, !isSimple && isDiff() && styles.diff)}>
                    {valueFirst}
                </TextBody>
            </GridCol>
            {!isSimple && (
                <GridCol setWidth="one-third">
                    <TextBody size="S" className={classNames(styles.textRow, isDiff() && styles.diff)}>
                        {valueSec}
                    </TextBody>
                </GridCol>
            )}
        </GridRow>
    )
}

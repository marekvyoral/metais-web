import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { GridCol, GridRow, TextBody } from '@isdd/idsk-ui-kit'

import styles from './definitionList.module.scss'

interface IDefinitionListItemProps extends PropsWithChildren {
    label?: string | React.ReactNode
    value: string | React.ReactNode | undefined
    valueWarning?: boolean
    secColValue?: string | React.ReactNode | undefined
    lang?: string | undefined
    href?: string
}

export const DefinitionListItem: React.FC<IDefinitionListItemProps> = ({ label, value, secColValue, valueWarning, lang }) => {
    return (
        <GridRow className={styles.groupRow}>
            {label && (
                <GridCol setWidth="one-third">
                    <dt className={classNames('govuk-label', styles.dt)}>{label}</dt>
                </GridCol>
            )}
            <GridCol setWidth={secColValue ? (label ? 'one-third' : 'one-half') : 'two-thirds'}>
                <dd className={styles.dd}>
                    <TextBody className={classNames({ [styles.valueRed]: valueWarning })} lang={lang}>
                        {value}
                    </TextBody>
                </dd>
            </GridCol>
            {secColValue && (
                <GridCol setWidth={label ? 'one-third' : 'one-half'}>
                    <dd className={styles.dd}>
                        <TextBody lang={lang}>{secColValue}</TextBody>
                    </dd>
                </GridCol>
            )}
        </GridRow>
    )
}

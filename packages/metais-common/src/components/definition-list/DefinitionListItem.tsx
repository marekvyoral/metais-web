import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { GridCol, GridRow, InfoIconWithText, TextBody } from '@isdd/idsk-ui-kit'

import styles from './definitionList.module.scss'

interface IDefinitionListItemProps extends PropsWithChildren {
    label?: string | React.ReactNode
    value: string | React.ReactNode | undefined
    valueWarning?: boolean
    secColValue?: string | React.ReactNode | undefined
    lang?: string | undefined
    href?: string
    tooltip?: string
    hideIcon?: boolean
}

export const DefinitionListItem: React.FC<IDefinitionListItemProps> = ({ label, value, secColValue, valueWarning, lang, tooltip, hideIcon }) => {
    return (
        <GridRow className={styles.groupRow}>
            {(label || tooltip || hideIcon) && (
                <GridCol setWidth="one-third">
                    <TextBody className={styles.labelWrapper} lang={lang}>
                        <dt tabIndex={0} className={classNames('govuk-label', styles.dt)}>
                            {label}
                        </dt>
                        {tooltip && <InfoIconWithText tooltip={tooltip} hideIcon={hideIcon} label={label} />}
                    </TextBody>
                </GridCol>
            )}

            <GridCol setWidth={secColValue ? (label ? 'one-third' : 'one-half') : 'two-thirds'}>
                <dd tabIndex={0} className={styles.dd}>
                    <TextBody className={classNames({ [styles.valueRed]: valueWarning })} lang={lang}>
                        {value}
                    </TextBody>
                </dd>
            </GridCol>
            {secColValue && (
                <GridCol setWidth={label ? 'one-third' : 'one-half'}>
                    <dd tabIndex={0} className={styles.dd}>
                        <TextBody lang={lang}>{secColValue}</TextBody>
                    </dd>
                </GridCol>
            )}
        </GridRow>
    )
}

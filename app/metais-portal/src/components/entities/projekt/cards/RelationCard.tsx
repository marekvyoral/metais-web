import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './relationCard.module.scss'
import { RelationAttribute } from './RelationAttribute'

import { GridRow } from '@/components/grid/GridRow'
import { GridCol } from '@/components/grid/GridCol'
import { TextBody } from '@/components/typography/TextBody'

interface IRelationCardProps extends PropsWithChildren {
    label: React.ReactNode
    status: 'Zneplatnené' | 'Vytvorené'
    codeMetaIS: string

    name: string
    admin: React.ReactNode
    relations: React.ReactNode
}

export const RelationCard: React.FC<IRelationCardProps> = ({ codeMetaIS, status, label, name, admin, relations }) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={classNames([styles.itemBox], { [styles.errorItemBox]: status === 'Zneplatnené' })}>
                <GridRow className={styles.heading}>
                    <GridCol setWidth="one-third">
                        <p className={styles.withoutMargin}>{label}</p>
                    </GridCol>
                    <GridCol setWidth="two-thirds">
                        <div className={styles.itemContent}>
                            <TextBody size="S" className={styles.headingItem}>
                                <span className="govuk-!-font-weight-bold">{t('relationCard.codeMetaIS') + ': '}</span>
                                <span>{codeMetaIS}</span>
                            </TextBody>

                            <TextBody size="S" className={styles.headingItem}>
                                <span className="govuk-!-font-weight-bold">{t('relationCard.status') + ' '}</span>
                                <span className={classNames({ [styles.errorItemText]: status === 'Zneplatnené' })}>{status}</span>
                            </TextBody>
                        </div>
                    </GridCol>
                </GridRow>

                <RelationAttribute name={t('relationCard.name')} value={name} />
                <RelationAttribute name={t('relationCard.codeMetaIS')} value={codeMetaIS} />
                <RelationAttribute name={t('relationCard.admin')} value={admin} />
                <RelationAttribute name={t('relationCard.relations')} value={relations} />
            </div>
        </>
    )
}

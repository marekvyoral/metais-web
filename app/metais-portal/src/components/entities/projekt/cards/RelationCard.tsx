import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

import styles from './relationCard.module.scss'
import { RelationAttribute } from './RelationAttribute'

import { GridRow } from '@/components/grid/GridRow'
import { GridCol } from '@/components/grid/GridCol'

interface IRelationCardProps extends PropsWithChildren {
    label: React.ReactNode
    status?: string
    codeMetaIS: string

    name: string
    admin: React.ReactNode
    relations: React.ReactNode[]
}

export const RelationCard: React.FC<IRelationCardProps> = ({ codeMetaIS, status, label, name, admin, relations }) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={classNames([styles.itemBox], { [styles.errorItemBox]: status === 'INVALIDATED' })}>
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
                                <span className={classNames({ [styles.errorItemText]: status === 'INVALIDATED' })}>
                                    {t(`metaAttributes.state.${status}`)}
                                </span>
                            </TextBody>
                        </div>
                    </GridCol>
                </GridRow>

                <RelationAttribute name={t('relationCard.name')} value={name} />
                <RelationAttribute name={t('relationCard.codeMetaIS')} value={codeMetaIS} />
                <RelationAttribute name={t('relationCard.admin')} value={admin} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {relations.map((relation, index) => (
                        <RelationAttribute key={index} name={t('relationCard.relations')} value={relation} />
                    ))}
                </div>
            </div>
        </>
    )
}

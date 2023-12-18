import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { GridRow } from '@isdd/idsk-ui-kit/grid/GridRow'
import { GridCol } from '@isdd/idsk-ui-kit/grid/GridCol'
import { TextLinkExternal } from '@isdd/idsk-ui-kit/typography/TextLinkExternal'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import styles from './relationCard.module.scss'
import { RelationAttribute } from './RelationAttribute'

interface IRelationCardProps extends PropsWithChildren {
    label: string
    labelHref: string
    status?: string
    codeMetaIS: string

    name: string
    admin: React.ReactNode
    relations?: { title: string; href: string }[]
}

export const RelationCard: React.FC<IRelationCardProps> = ({ codeMetaIS, status, label, labelHref, name, admin, relations }) => {
    const { t } = useTranslation()
    return (
        <>
            <div className={classNames([styles.itemBox], { [styles.errorItemBox]: status === 'INVALIDATED' })}>
                <GridRow className={styles.heading}>
                    <GridCol setWidth="one-third">
                        <p className={styles.withoutMargin}>
                            <TextLinkExternal title={label} href={labelHref} textLink={label} newTab />
                        </p>
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
                <DefinitionList>
                    <RelationAttribute name={t('relationCard.name')} value={name} />

                    <RelationAttribute name={t('relationCard.codeMetaIS')} value={codeMetaIS} />
                    <RelationAttribute name={t('relationCard.admin')} value={admin} />
                    {relations?.map((relation, index) => (
                        <RelationAttribute
                            key={relation.title + index}
                            name={index === 0 ? t('relationCard.relations') : ''}
                            value={<TextLinkExternal title={relation.title} href={relation.href} textLink={relation.title} newTab />}
                        />
                    ))}
                </DefinitionList>
            </div>
        </>
    )
}

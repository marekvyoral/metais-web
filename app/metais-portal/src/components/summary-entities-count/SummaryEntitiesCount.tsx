import { TextBody } from '@isdd/idsk-ui-kit/index'
import { ENTITY_KS, ENTITY_AS, ENTITY_ISVS, ENTITY_PROJECT, ELASTIC_MAX_RECORDS } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import styles from './styles.module.scss'

import { useEntitiesCountsSummary } from '@/hooks/useEntitiesCountsSummary'
import { DivWithShadow } from '@/components/div-with-shadow/DivWithShadow'

export type EntityCountProps = {
    label: string
    count: number
    href: string
    isOperated?: boolean
}

export const EntityCount: React.FC<EntityCountProps> = ({ label, count, href, isOperated }) => {
    const { t } = useTranslation()
    return (
        <div>
            <TextBody size="L" className={styles.h1}>
                {count === ELASTIC_MAX_RECORDS ? (
                    <>
                        <TextBody className="marginBottom0" size="S">
                            {t('entitySummary.moreThan')}
                        </TextBody>
                        {count}
                    </>
                ) : (
                    count
                )}
            </TextBody>
            <Link to={href} className={styles.link}>
                <TextBody size="S" className={classNames({ [styles.noMargin]: isOperated })}>
                    {label}
                </TextBody>
                <TextBody size="S" className={styles.noMargin}>
                    {isOperated && t('entitySummary.operated')}
                </TextBody>
            </Link>
        </div>
    )
}

export const SummaryEntitiesCounts: React.FC = () => {
    const { t } = useTranslation()

    const { codelistCount, projectCount, ksSelfCount, ksStateCount, asCount, isvsCount, isError, isLoading } = useEntitiesCountsSummary()

    const ksStateFilterSearch = '?EA_Profil_KS_typ_ks--eq=c_typ_ks.1%2Bc_typ_ks.5%2Bc_typ_ks.4&state--ilike=DRAFT&pageNumber=1'
    const ksSelfFilterSearch = '?pageNumber=1&state--ilike=DRAFT&EA_Profil_KS_typ_ks--eq=c_typ_ks.2%2Bc_typ_ks.3&Profil_UPVS_je_genericka--eq=true'
    const draftStateFilterSearch = '?pageNumber=1&state--ilike=DRAFT'

    const sections: EntityCountProps[] = [
        {
            label: t('entitySummary.ksState'),
            href: `/ci/${ENTITY_KS}${ksStateFilterSearch}`,
            count: ksStateCount,
            isOperated: true,
        },
        {
            label: t('entitySummary.ksSelf'),
            href: `/ci/${ENTITY_KS}${ksSelfFilterSearch}`,
            count: ksSelfCount,
            isOperated: true,
        },
        {
            label: t('entitySummary.project'),
            href: `/ci/${ENTITY_PROJECT}`,
            count: projectCount,
        },
        {
            label: t('entitySummary.as'),
            href: `/ci/${ENTITY_AS}${draftStateFilterSearch}`,
            count: asCount,
        },
        {
            label: t('entitySummary.isvs'),
            href: `/ci/${ENTITY_ISVS}${draftStateFilterSearch}`,
            count: isvsCount,
        },
        {
            label: t('entitySummary.codelist'),
            href: `${NavigationSubRoutes.CODELIST}`,
            count: codelistCount,
        },
    ]

    return (
        <QueryFeedback withChildren loading={isLoading} error={isError} indicatorProps={{ label: t('entitySummary.loading') }}>
            <DivWithShadow className={styles.marginBottom4}>
                <div className={styles.countsDiv}>
                    {sections.map((section, index) => (
                        <EntityCount key={index} label={section.label} count={section.count} href={section.href} isOperated={section.isOperated} />
                    ))}
                </div>
            </DivWithShadow>
        </QueryFeedback>
    )
}

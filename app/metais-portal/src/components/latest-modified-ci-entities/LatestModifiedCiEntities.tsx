import { TextBody, GridRow, GridCol, Card } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { truncateWithEllipsis } from '@isdd/metais-common/src/componentHelpers/formatting/ellipsis'

import styles from './styles.module.scss'

import { DivWithShadow } from '@/components/div-with-shadow/DivWithShadow'
import { useGetLastEditedEntities } from '@/hooks/useGetLastEditedEntities'

export const LatestModifiedCiEntities = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const LATEST_COUNT = 3
    const { data, isError: isLatestError, isLoading: isLatestLoading, ciTypes } = useGetLastEditedEntities(LATEST_COUNT)

    return (
        <QueryFeedback withChildren loading={isLatestLoading} error={isLatestError} indicatorProps={{ label: t('entitySummary.loadingLatestCi') }}>
            <DivWithShadow className={styles.marginBottom8}>
                <TextBody>
                    <strong>{t('entitySummary.lastModifiedEntities')}</strong>
                </TextBody>

                <GridRow>
                    {data?.configurationItemSet?.map((item) => {
                        const matchedCiType = ciTypes?.results?.find((ci) => ci.technicalName === item.type)
                        return (
                            <GridCol key={item?.uuid} setWidth="one-third">
                                <Card
                                    title={item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                    cardHref={`/ci/${item?.type}/${item?.uuid}`}
                                    description={truncateWithEllipsis(item?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_popis] ?? '', 100)}
                                    date={t('dateTime', { date: item?.metaAttributes?.lastModifiedAt })}
                                    tag1={{
                                        title: language == Languages.SLOVAK ? matchedCiType?.name ?? '' : matchedCiType?.engName ?? '',
                                        href: `ci/${item?.type}`,
                                    }}
                                />
                            </GridCol>
                        )
                    })}
                </GridRow>
            </DivWithShadow>
        </QueryFeedback>
    )
}

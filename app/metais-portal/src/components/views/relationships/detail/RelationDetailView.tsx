import { BreadCrumbs, Button, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationDetailProps } from '@/components/containers/RelationDetailContainer'

type Props = RelationDetailProps & {
    entityName: string
    entityId: string
    relationshipId: string
}

export const RelationDetailView: React.FC<Props> = ({ entityName, relationshipId, entityId, data, isLoading, isError }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { ownerData, relationTypeData, relationshipData, ciSourceData, ciTargetData } = data

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName, href: `/ci/${entityName}` },
                    {
                        label: ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                    {
                        label: t('relationDetail.heading', { item: relationTypeData?.name }) ?? t('breadcrumbs.noName'),
                        href: `/relation/${entityName}/${entityId}/${relationshipId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{t('relationDetail.heading', { item: relationTypeData?.name })}</TextHeading>
                        <QueryFeedback loading={false} error={isError} />
                    </FlexColumnReverseWrapper>

                    <DefinitionList>
                        <InformationGridRow label={t('relationDetail.source')} value={ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]} />
                        <InformationGridRow label={t('relationDetail.target')} value={ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]} />

                        <InformationGridRow
                            label={t('relationDetail.owner')}
                            value={
                                ownerData?.configurationItemUi?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] + ' - ' + ownerData?.role?.description
                            }
                        />
                        <InformationGridRow
                            label={t('relationDetail.evidenceStatus')}
                            value={t(`metaAttributes.state.${relationshipData?.metaAttributes?.state}`)}
                        />
                    </DefinitionList>

                    <DefinitionList>
                        {relationTypeData?.attributes
                            ?.concat(relationTypeData?.attributeProfiles?.flatMap((profile) => profile.attributes ?? []) ?? [])
                            .map((attribute) => {
                                const value = relationshipData?.attributes?.find((relAttr) => relAttr.name === attribute.technicalName)?.value

                                return (
                                    <InformationGridRow
                                        key={attribute.technicalName}
                                        label={attribute.name ?? ''}
                                        //cause of bad generated type
                                        value={typeof value == 'string' ? value : ''}
                                    />
                                )
                            })}
                    </DefinitionList>
                    <Button variant="secondary" label={t('relationDetail.back')} onClick={() => navigate(-1)} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

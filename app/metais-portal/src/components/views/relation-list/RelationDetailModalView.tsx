import { AccordionContainer, TextHeading } from '@isdd/idsk-ui-kit/index'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ATTRIBUTE_NAME, QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DESCRIPTION, HTML_TYPE, INVALIDATED } from '@isdd/metais-common/constants'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import classNames from 'classnames'
import styles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'

import { RelationDetailProps } from '@/components/containers/RelationDetailContainer'

type Props = RelationDetailProps

export const RelationDetailModalView: React.FC<Props> = ({ data, isLoading, isError }) => {
    const { t, i18n } = useTranslation()

    const { ownerData, relationTypeData, relationshipData, ciSourceData, ciTargetData, constraintsData, unitsData } = data
    const isInvalidated = relationshipData?.metaAttributes?.state === INVALIDATED

    const tabsFromApi =
        relationTypeData?.attributeProfiles
            ?.filter((p) => p.valid)
            .map((attributesProfile) => {
                return {
                    title:
                        (i18n.language === Languages.SLOVAK ? attributesProfile.description : attributesProfile.engDescription) ??
                        attributesProfile.name ??
                        '',
                    content: (
                        <DefinitionList>
                            {attributesProfile?.attributes
                                ?.filter((atr) => atr.valid === true && atr.invisible !== true)
                                .sort((atr1, atr2) => (atr1.order || 0) - (atr2.order || 0))
                                .map((attribute) => {
                                    const formattedRowValue = pairEnumsToEnumValues({
                                        attribute,
                                        ciItemData: relationshipData,
                                        constraintsData,
                                        t,
                                        unitsData,
                                        matchedAttributeNamesToCiItem: undefined,
                                    })
                                    const isHTML = attribute.type === HTML_TYPE
                                    return (
                                        attribute?.valid &&
                                        !attribute.invisible && (
                                            <InformationGridRow
                                                key={attribute.technicalName}
                                                label={attribute.name ?? ''}
                                                value={
                                                    isHTML ? (
                                                        <SafeHtmlComponent dirtyHtml={(formattedRowValue as string)?.replace(/\n/g, '<br>')} />
                                                    ) : (
                                                        formattedRowValue
                                                    )
                                                }
                                            />
                                        )
                                    )
                                })}
                        </DefinitionList>
                    ),
                }
            }) ?? []

    return (
        <>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <TextHeading size="XL" className={classNames({ [styles.invalidated]: isInvalidated })}>
                    <Trans
                        i18nKey="relationshipList.summaryValue"
                        components={{
                            strong: <strong />,
                        }}
                        values={{
                            startName: ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                            endName: ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                        }}
                    />
                </TextHeading>
                <DefinitionList>
                    <InformationGridRow
                        label={t('newRelation.relation')}
                        value={
                            <Link to={`/relation/${ciSourceData?.type}/${ciSourceData?.uuid}/${relationshipData?.uuid}`}>
                                <Trans
                                    i18nKey="relationshipList.summaryValue"
                                    components={{
                                        strong: <strong />,
                                    }}
                                    values={{
                                        startName: ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                                        endName: ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                                    }}
                                />
                            </Link>
                        }
                    />
                    <InformationGridRow
                        label={t('relationDetail.source')}
                        value={
                            <Link to={`/ci/${ciSourceData?.type}/${ciSourceData?.uuid}`}>
                                {ciSourceData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                            </Link>
                        }
                    />
                    <InformationGridRow
                        label={t('relationDetail.target')}
                        value={
                            <Link to={`/ci/${ciTargetData?.type}/${ciTargetData?.uuid}`}>
                                {ciTargetData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                            </Link>
                        }
                    />
                    <InformationGridRow
                        label={t('relationDetail.owner')}
                        value={ownerData?.configurationItemUi?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] + ' - ' + ownerData?.role?.description}
                    />
                    <InformationGridRow
                        label={t('relationDetail.evidenceStatus')}
                        value={t(`metaAttributes.state.${relationshipData?.metaAttributes?.state}`)}
                    />
                    {relationTypeData?.attributes?.map((attribute) => {
                        const rowValue = pairEnumsToEnumValues({
                            attribute,
                            ciItemData: relationshipData,
                            constraintsData,
                            t,
                            unitsData,
                            matchedAttributeNamesToCiItem: undefined,
                        })
                        const isHTML = attribute.type === HTML_TYPE || attribute.name == DESCRIPTION

                        return (
                            <InformationGridRow
                                key={attribute.technicalName}
                                label={(i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName) ?? attribute.name ?? ''}
                                value={isHTML ? <SafeHtmlComponent dirtyHtml={(rowValue as string)?.replace(/\n/g, '<br>')} /> : rowValue}
                            />
                        )
                    })}
                </DefinitionList>

                <AccordionContainer sections={[...tabsFromApi]} />
            </QueryFeedback>
        </>
    )
}

import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { DESCRIPTION, HTML_TYPE } from '@isdd/metais-common/constants'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/src/hooks/useGetCiTypeConstraintsData'
import { Languages } from '@isdd/metais-common/localization/languages'

interface CiInformationData {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        gestorData: RoleParticipantUI[] | undefined
    }
    isError: boolean
    isLoading: boolean
    additionalBasicInformation?: {
        top?: React.ReactNode
        bottom?: React.ReactNode
    }
    withoutDescription?: boolean
    withoutTime?: boolean
}
// Plánované ročné prevádzkové náklady projektu v EUR
export const CiInformationAccordion: React.FC<CiInformationData> = ({
    data: { ciItemData, ciTypeData, constraintsData, unitsData },
    isLoading,
    isError,
    additionalBasicInformation,
    withoutDescription = false,
    withoutTime = false,
}) => {
    const { t, i18n } = useTranslation()

    const {
        isLoading: isCiConstraintLoading,
        isError: isCiConstraintError,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, [ciItemData ?? {}])

    const currentEntityCiTypeConstraintsData = uuidsToMatchedCiItemsMap[ciItemData?.uuid ?? '']

    const tabsFromApi =
        ciTypeData?.attributeProfiles?.map((attributesProfile) => {
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
                                    ciItemData,
                                    constraintsData,
                                    t,
                                    unitsData,
                                    matchedAttributeNamesToCiItem: currentEntityCiTypeConstraintsData,
                                    withDescription: !withoutDescription,
                                    withoutTime,
                                })
                                const isHTML = attribute.type === HTML_TYPE
                                return (
                                    !attribute?.invisible && (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={(i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName) ?? ''}
                                            value={isHTML ? <SafeHtmlComponent dirtyHtml={formattedRowValue} /> : formattedRowValue}
                                            tooltip={attribute?.description}
                                            lang={setEnglishLangForAttr(attribute.technicalName ?? '')}
                                        />
                                    )
                                )
                            })}
                    </DefinitionList>
                ),
            }
        }) ?? []

    return (
        <QueryFeedback
            loading={isLoading || isCiConstraintLoading}
            error={isError || isCiConstraintError}
            errorProps={{ errorMessage: isCiConstraintError ? t('ciInformationAccordion.error') : undefined }}
            withChildren
        >
            <AccordionContainer
                sections={[
                    {
                        title: t('ciInformationAccordion.basicInformation'),
                        onLoadOpen: true,
                        content: (
                            <DefinitionList>
                                {additionalBasicInformation?.top}
                                {ciTypeData?.attributes?.map((attribute) => {
                                    const rowValue = pairEnumsToEnumValues({
                                        attribute,
                                        ciItemData,
                                        constraintsData,
                                        t,
                                        unitsData,
                                        matchedAttributeNamesToCiItem: currentEntityCiTypeConstraintsData,
                                        withDescription: !withoutDescription,
                                        withoutTime,
                                    })
                                    const isHTML = attribute.type === HTML_TYPE || attribute.name == DESCRIPTION

                                    return (
                                        <InformationGridRow
                                            key={attribute?.technicalName}
                                            label={(i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName) ?? ''}
                                            value={isHTML ? <SafeHtmlComponent dirtyHtml={rowValue?.replace(/\n/g, '<br>')} /> : rowValue}
                                            tooltip={attribute?.description}
                                            lang={setEnglishLangForAttr(attribute.technicalName ?? '')}
                                        />
                                    )
                                })}
                                {additionalBasicInformation?.bottom}
                            </DefinitionList>
                        ),
                    },
                    ...tabsFromApi,
                ]}
            />
        </QueryFeedback>
    )
}

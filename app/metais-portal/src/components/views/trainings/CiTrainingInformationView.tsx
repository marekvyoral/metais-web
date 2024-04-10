import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { DESCRIPTION, HTML_TYPE } from '@isdd/metais-common/constants'
import { QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/src/hooks/useGetCiTypeConstraintsData'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface CiInformationData {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        gestorData: RoleParticipantUI[] | undefined
        roleParticipant?: RoleParticipantUI
    }
    isError: boolean
    isLoading: boolean
    additionalBasicInformation?: {
        top?: React.ReactNode
        bottom?: React.ReactNode
    }
    withoutDescription?: boolean
}

const TRAINING_GESTOR = 'TRAINING_GESTOR'

export const CiTrainingInformationView: React.FC<CiInformationData> = ({
    data: { ciItemData, ciTypeData, constraintsData, unitsData, roleParticipant },
    isLoading,
    isError,
    additionalBasicInformation,
    withoutDescription = false,
}) => {
    const { t, i18n } = useTranslation()

    const {
        isLoading: isCiConstraintLoading,
        isError: isCiConstraintError,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, [ciItemData ?? {}])

    const currentEntityCiTypeConstraintsData = uuidsToMatchedCiItemsMap[ciItemData?.uuid ?? '']

    const profileAttributes =
        ciTypeData?.attributeProfiles
            ?.filter((p) => p.valid)
            .reduce((accumulator: Attribute[], item) => {
                return [...accumulator, ...(item?.attributes ?? [])]
            }, []) ?? []
    const attributeList = [...(ciTypeData?.attributes ?? []), ...profileAttributes]
    const gestorAttribute: Attribute = { technicalName: TRAINING_GESTOR }
    attributeList.splice(1, 0, gestorAttribute)

    return (
        <QueryFeedback
            loading={isLoading || isCiConstraintLoading}
            error={isError || isCiConstraintError}
            showSupportEmail
            errorProps={{ errorMessage: isCiConstraintError ? t('ciInformationAccordion.error') : undefined }}
            withChildren
        >
            <DefinitionList>
                {additionalBasicInformation?.top}
                {attributeList?.map((attribute) => {
                    if (attribute.technicalName === TRAINING_GESTOR)
                        return (
                            <InformationGridRow
                                label={t('trainings.trainingGestor')}
                                value={roleParticipant?.configurationItemUi?.attributes?.Gen_Profil_nazov}
                                tooltip={t('trainings.trainingGestorTooltip')}
                            />
                        )
                    const rowValue = pairEnumsToEnumValues({
                        attribute,
                        ciItemData,
                        constraintsData,
                        t,
                        unitsData,
                        matchedAttributeNamesToCiItem: currentEntityCiTypeConstraintsData,
                        withDescription: !withoutDescription,
                    })
                    const isHTML = attribute.type === HTML_TYPE || attribute.name == DESCRIPTION

                    return (
                        <InformationGridRow
                            key={attribute?.technicalName}
                            label={(i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName) ?? ''}
                            value={isHTML ? <SafeHtmlComponent dirtyHtml={(rowValue as string)?.replace(/\n/g, '<br>')} /> : rowValue}
                            tooltip={attribute?.description}
                            lang={setEnglishLangForAttr(attribute.technicalName ?? '')}
                        />
                    )
                })}
                {additionalBasicInformation?.bottom}
            </DefinitionList>
        </QueryFeedback>
    )
}

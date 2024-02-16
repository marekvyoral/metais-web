import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { ConfigurationItemUi, RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ATTRIBUTE_NAME, QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import {
    DESCRIPTION,
    ENTITY_PROJECT,
    Gui_Profil_DIZ_konzumujuci_projekt,
    Gui_Profil_DIZ_poskytujuci_projekt,
    HTML_TYPE,
    INTEGRACIA_Profil_Integracia_stav_diz,
    STAV_DIZ_ENUM_CODE,
} from '@isdd/metais-common/constants'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { AttributeProfile, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useGetCiTypeConstraintsData } from '@isdd/metais-common/src/hooks/useGetCiTypeConstraintsData'
import { Languages } from '@isdd/metais-common/localization/languages'
import { FindAll311200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { Link } from 'react-router-dom'
import { Metadata } from '@isdd/metais-common/api/generated/dms-swagger'
import { bytesToMB } from '@isdd/metais-common/utils/utils'
import { BaseModal, ButtonLink } from '@isdd/idsk-ui-kit/index'

import { IntegrationLinkMetadata } from './IntegrationLinkMetadata'
import styles from './integration.module.scss'

import { getAttributeValue } from '@/componentHelpers/ci'
import { DmsFileHistory } from '@/components/dms-file-history/DmsFileHistory'

interface Props {
    data: {
        ciItemData: ConfigurationItemUi | undefined
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        gestorData: RoleParticipantUI[] | undefined
        consumingProjectData: ConfigurationItemUi | undefined
        providingProjectData: ConfigurationItemUi | undefined
        lastModifiedByIdentityData: FindAll311200 | undefined
        createdByIdentityData: FindAll311200 | undefined
        dizProfileData: AttributeProfile | undefined
        dmsFileMetaData: Metadata | undefined
    }
    isError: boolean
    isLoading: boolean
    isDmsFileError: boolean
}

export const IntegrationLinkAccordion: React.FC<Props> = ({
    data: {
        ciItemData,
        ciTypeData,
        constraintsData,
        unitsData,
        consumingProjectData,
        createdByIdentityData,
        lastModifiedByIdentityData,
        providingProjectData,
        gestorData,
        dizProfileData,
        dmsFileMetaData,
    },
    isLoading,
    isError,
    isDmsFileError,
}) => {
    const { t, i18n } = useTranslation()
    const {
        isLoading: isCiConstraintLoading,
        isError: isCiConstraintError,
        uuidsToMatchedCiItemsMap,
    } = useGetCiTypeConstraintsData(ciTypeData, [ciItemData ?? {}])

    const currentEntityCiTypeConstraintsData = uuidsToMatchedCiItemsMap[ciItemData?.uuid ?? '']

    const consumingProjectAttribute = dizProfileData?.attributes?.find((att) => att.technicalName == Gui_Profil_DIZ_konzumujuci_projekt)
    const providingProjectAttribute = dizProfileData?.attributes?.find((att) => att.technicalName === Gui_Profil_DIZ_poskytujuci_projekt)
    const dmsDizDocumentAttribute = dizProfileData?.attributes?.find((att) => att.technicalName === 'Gui_Profil_DIZ_dokument_v_dms')

    const dizStatusAttribute = ciTypeData?.attributeProfiles
        ?.flatMap((profile) => profile.attributes)
        .find((att) => att?.technicalName == INTEGRACIA_Profil_Integracia_stav_diz)

    const consumingProjectValue = getAttributeValue(consumingProjectData, ATTRIBUTE_NAME.Gen_Profil_nazov)
    const providingProjectValue = getAttributeValue(providingProjectData, ATTRIBUTE_NAME.Gen_Profil_nazov)
    const dizStatusValue = constraintsData
        ?.find((item) => item?.code === STAV_DIZ_ENUM_CODE)
        ?.enumItems?.find((item) => item.code === ciItemData?.attributes?.[INTEGRACIA_Profil_Integracia_stav_diz])?.value

    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    return (
        <QueryFeedback
            loading={isLoading || isCiConstraintLoading}
            error={isError || isCiConstraintError}
            errorProps={{ errorMessage: isCiConstraintError ? t('ciInformationAccordion.error') : undefined }}
            showSupportEmail
            withChildren
        >
            <AccordionContainer
                sections={[
                    {
                        title: t('ciInformationAccordion.basicInformation'),
                        onLoadOpen: true,
                        content: (
                            <DefinitionList>
                                {ciTypeData?.attributes?.map((attribute) => {
                                    const withDescription = true
                                    const rowValue = pairEnumsToEnumValues({
                                        attribute,
                                        ciItemData,
                                        constraintsData,
                                        t,
                                        unitsData,
                                        matchedAttributeNamesToCiItem: currentEntityCiTypeConstraintsData,
                                        withDescription,
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
                                <InformationGridRow
                                    label={consumingProjectAttribute?.name}
                                    value={
                                        <Link to={`/ci/${ENTITY_PROJECT}/${consumingProjectData?.uuid}`} target="_blank">
                                            {consumingProjectValue}
                                        </Link>
                                    }
                                    tooltip={consumingProjectAttribute?.description}
                                />
                                <InformationGridRow
                                    label={providingProjectAttribute?.name}
                                    value={
                                        <Link to={`/ci/${ENTITY_PROJECT}/${providingProjectData?.uuid}`} target="_blank">
                                            {providingProjectValue}
                                        </Link>
                                    }
                                    tooltip={providingProjectAttribute?.description}
                                />
                                <InformationGridRow
                                    label={dizStatusAttribute?.name}
                                    value={dizStatusValue}
                                    tooltip={dizStatusAttribute?.description}
                                />
                                {!isLoading && (
                                    <InformationGridRow
                                        label={dmsDizDocumentAttribute?.name}
                                        value={
                                            !isDmsFileError && (
                                                <Link
                                                    to={`${import.meta.env.VITE_REST_CLIENT_BASE_URL}/dms/file/${ciItemData?.uuid}`}
                                                    target="_blank"
                                                >
                                                    <>{`${dmsFileMetaData?.filename} (${bytesToMB(dmsFileMetaData?.contentLength ?? 0)} Mb)`}</>
                                                </Link>
                                            )
                                        }
                                        secColValue={
                                            !isDmsFileError && (
                                                <ButtonLink
                                                    className={styles.blue}
                                                    label={t('integrationLinks.openDocHistory')}
                                                    onClick={() => setIsHistoryOpen(true)}
                                                />
                                            )
                                        }
                                        tooltip={dmsDizDocumentAttribute?.description}
                                    />
                                )}
                            </DefinitionList>
                        ),
                    },
                    {
                        title: t('integrationLinks.otherInformation'),
                        content: (
                            <IntegrationLinkMetadata
                                createdByIdentityData={createdByIdentityData}
                                lastModifiedByIdentityData={lastModifiedByIdentityData}
                                gestorData={gestorData}
                                ciItemData={ciItemData}
                            />
                        ),
                    },
                ]}
            />

            <BaseModal isOpen={isHistoryOpen} close={() => setIsHistoryOpen(false)}>
                <DmsFileHistory entityId={ciItemData?.uuid ?? ''} itemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]} />
            </BaseModal>
        </QueryFeedback>
    )
}

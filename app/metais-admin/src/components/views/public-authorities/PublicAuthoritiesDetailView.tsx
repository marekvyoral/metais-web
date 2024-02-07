import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroupRow, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { MutationFeedback, QueryFeedback, pairEnumsToEnumValues } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { DESCRIPTION, HTML_TYPE } from '@isdd/metais-common/constants'
import { Languages } from '@isdd/metais-common/localization/languages'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { setEnglishLangForAttr } from '@isdd/metais-common/componentHelpers/englishAttributeLang'
import classNames from 'classnames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import styles from '@/components/views/public-authorities/styles.module.scss'
import { IPublicAuthoritiesDetail } from '@/components/containers/public-authorities/PublicAuthoritiesDetailContainer'

interface Props extends IPublicAuthoritiesDetail {
    isError: boolean
    isLoading: boolean
}

const PublicAuthoritiesDetailView: React.FC<Props> = ({
    setInvalid,
    setValid,
    configurationItem,
    isError,
    isLoading,
    constraintsData,
    unitsData,
    currentEntityCiTypeConstraintsData,
    ciTypeData,
}) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const getSuccessMsg = (type: string | undefined) => {
        switch (type) {
            case 'create':
                return t('mutationFeedback.successfulCreated')
            case 'edit':
                return t('mutationFeedback.successfulUpdated')
            case 'valid':
                return t('mutationFeedback.validatePOSuccess')
            case 'invalid':
                return t('mutationFeedback.invalidatePOSuccess')
            default:
                return t('mutationFeedback.successfulUpdated')
        }
    }

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess.value, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <FlexColumnReverseWrapper>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <TextHeading
                        size="L"
                        className={classNames({ [styles.invalidated]: configurationItem?.metaAttributes?.state === 'INVALIDATED' })}
                    >
                        {t('publicAuthorities.detail.title')} - {configurationItem?.attributes?.Gen_Profil_nazov}
                    </TextHeading>
                    <ButtonGroupRow>
                        {configurationItem?.metaAttributes?.state === 'DRAFT' && (
                            <>
                                <Button
                                    label={t('egov.edit')}
                                    onClick={() => {
                                        navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES}/${configurationItem?.uuid}/edit`, {
                                            state: { from: location },
                                        })
                                    }}
                                />

                                <Button
                                    label={t('egov.detail.validityChange.setInvalid')}
                                    onClick={() => setInvalid?.(configurationItem?.uuid, configurationItem)}
                                />
                            </>
                        )}
                        {configurationItem?.metaAttributes?.state === 'INVALIDATED' && (
                            <Button label={t('egov.detail.validityChange.setValid')} onClick={() => setValid?.([configurationItem?.uuid ?? ''])} />
                        )}
                    </ButtonGroupRow>
                </div>
                <div ref={wrapperRef}>
                    <MutationFeedback
                        success={isActionSuccess.value}
                        error={false}
                        successMessage={getSuccessMsg(isActionSuccess.additionalInfo?.type)}
                    />
                </div>
            </FlexColumnReverseWrapper>
            <DefinitionList>
                {ciTypeData?.attributes?.map((attribute) => {
                    const withDescription = true
                    const rowValue = pairEnumsToEnumValues({
                        attribute,
                        ciItemData: configurationItem,
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
            </DefinitionList>
            {ciTypeData?.attributeProfiles?.map((attributesProfile) => {
                return (
                    <DefinitionList key={attributesProfile.id}>
                        {attributesProfile?.attributes
                            ?.filter((atr) => atr.valid === true && atr.invisible !== true)
                            .sort((atr1, atr2) => (atr1.order || 0) - (atr2.order || 0))
                            .map((attribute) => {
                                const withDescription = true
                                const formattedRowValue = pairEnumsToEnumValues({
                                    attribute,
                                    ciItemData: configurationItem,
                                    constraintsData,
                                    t,
                                    unitsData,
                                    matchedAttributeNamesToCiItem: currentEntityCiTypeConstraintsData,
                                    withDescription,
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
                )
            })}
        </QueryFeedback>
    )
}

export default PublicAuthoritiesDetailView

import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM, INVALIDATED, integrationHarmonogramTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { getIntegrationLinkTabList, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'

export const IntegrationLinkDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()

    const [selectedTab, setSelectedTab] = useState<string>()
    const isHarmonogram = selectedTab === integrationHarmonogramTab
    const isHarmonogramEdit = location.search.includes(INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM)

    document.title = `${t('titles.ciDetail', { ci: entityName })} | MetaIS`

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
        refetch,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED
    const userAbility = useUserAbility()
    const tabList = getIntegrationLinkTabList({ entityName: entityName ?? '', entityId: entityId ?? '', t, userAbility })

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: ciTypeName, href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading}>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                editButton={
                                    isHarmonogram ? (
                                        <Button
                                            label={
                                                isHarmonogramEdit
                                                    ? t('integrationLinks.cancelHarmonogramEdit')
                                                    : t('integrationLinks.editHarmonogram')
                                            }
                                            onClick={() => {
                                                isHarmonogramEdit ? navigate('?') : navigate(`?${INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM}`)
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            label={t('ciType.editButton')}
                                            onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                                        />
                                    )
                                }
                                entityData={ciItemData}
                                entityName={entityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError || isCiTypeDataError} />
                            {isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated' && (
                                <div ref={wrapperRef}>
                                    <MutationFeedback
                                        error={false}
                                        success={isActionSuccess.value}
                                        successMessage={
                                            isActionSuccess.additionalInfo?.type === 'create'
                                                ? t('mutationFeedback.successfulCreated')
                                                : t('mutationFeedback.successfulUpdated')
                                        }
                                    />
                                </div>
                            )}
                        </FlexColumnReverseWrapper>

                        <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

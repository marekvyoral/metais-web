import { Button, Tab, Tabs } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM, INVALIDATED, integrationHarmonogramTab } from '@isdd/metais-common/constants'
import { QueryFeedback, MutationFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ApiError, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from '@tanstack/react-query'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'

import { IntegrationDetailHeader } from './IntegrationDetailHeader'

type Props = {
    isLoading: boolean
    isError: boolean
    entityName: string
    entityId: string
    tabList: Tab[]
    ciItemData: ConfigurationItemUi | undefined
    ciTypeData: CiType | undefined
    refetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
}

export const IntegrationLinkDetail: React.FC<Props> = ({ isLoading, isError, entityName, entityId, tabList, refetch, ciItemData, ciTypeData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()
    const { isLoading: isAbilityLoading, isError: isAbilityError } = useAbilityContextWithFeedback()

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    const [selectedTab, setSelectedTab] = useState<string>()
    const isHarmonogram = selectedTab === integrationHarmonogramTab
    const isHarmonogramEdit = location.search.includes(INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM)

    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading || !!isAbilityLoading}>
            <FlexColumnReverseWrapper>
                <IntegrationDetailHeader
                    editButton={
                        isHarmonogram ? (
                            <Button
                                label={isHarmonogramEdit ? t('integrationLinks.cancelHarmonogramEdit') : t('integrationLinks.editHarmonogram')}
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
                <QueryFeedback loading={false} error={isError || isAbilityError} />
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
    )
}

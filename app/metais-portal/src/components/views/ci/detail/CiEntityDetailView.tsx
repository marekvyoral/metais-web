import { Tab, Button, Tabs } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ApiError } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { INVALIDATED, ciInformationTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { QueryFeedback, MutationFeedback } from '@isdd/metais-common/index'
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'
import { useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'

import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'

type Props = {
    isLoading: boolean
    isError: boolean
    entityName: string
    entityId: string
    ciItemData: ConfigurationItemUi | undefined
    ciTypeData: CiType | undefined
    tabList: Tab[]
    ciItemDataRefetch: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<ConfigurationItemUi, ApiError>>
}

export const CiEntityDetailView: FC<Props> = ({ isLoading, isError, entityName, entityId, ciItemData, ciTypeData, tabList, ciItemDataRefetch }) => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { isError: isAbilityError, isLoading: isAbilityLoading } = useAbilityContextWithFeedback()
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedTab, setSelectedTab] = useState<string>()
    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    return (
        <QueryFeedback loading={isLoading || !!isAbilityLoading}>
            <FlexColumnReverseWrapper>
                <CiEntityIdHeader
                    editButton={
                        <Button
                            label={t('ciType.editButton')}
                            onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                        />
                    }
                    entityData={ciItemData}
                    entityName={entityName ?? ''}
                    entityId={entityId ?? ''}
                    entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                    ciRoles={ciTypeData?.roleList ?? []}
                    isInvalidated={isInvalidated}
                    refetchCi={ciItemDataRefetch}
                />
                <QueryFeedback loading={false} error={isError || isAbilityError} />
                <ElementToScrollTo isVisible={isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated'}>
                    <MutationFeedback
                        error={false}
                        success={isActionSuccess.value}
                        successMessage={
                            isActionSuccess.additionalInfo?.type === 'create'
                                ? t('mutationFeedback.successfulCreated')
                                : t('mutationFeedback.successfulUpdated')
                        }
                    />
                </ElementToScrollTo>
            </FlexColumnReverseWrapper>

            <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />

            {selectedTab === ciInformationTab && <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />}
        </QueryFeedback>
    )
}

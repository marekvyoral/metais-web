import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetRights } from '@isdd/metais-common/api/generated/kris-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, ENTITY_KRIS, INVALIDATED, ciInformationTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import {
    getCiHowToBreadCrumb,
    getDefaultCiEntityTabList,
    useCiDetailPageTitle,
    useCiListPageHeading,
    useGetEntityParamsFromUrl,
} from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { KrisRelatedContainer } from '@/components/containers/KrisRelatedContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { KrisEntityIdHeader } from '@/components/views/ci/kris/KrisEntityIdHeader'
import { useCiCheckEntityTypeRedirectHook } from '@/hooks/useCiCheckEntityTypeRedirect.hook'

export interface OutletContextProps {
    updateButton: boolean
    setUpdateButton: React.Dispatch<React.SetStateAction<boolean>>
}

const OutletContext = createContext<OutletContextProps | undefined>(undefined)

const OutletProvider: React.FC<PropsWithChildren> = ({ children }) => {
    // Your context state and functions go here
    const [updateButton, setUpdateButton] = useState(false)
    const contextValue: OutletContextProps = {
        updateButton,
        setUpdateButton,
    }
    return <OutletContext.Provider value={contextValue}>{children}</OutletContext.Provider>
}

export const useOutletContext = (): OutletContextProps => {
    const context = useContext(OutletContext)
    if (!context) {
        throw new Error('useOutletContext must be used within an OutletProvider')
    }
    return context
}

const KrisEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()
    const {
        state: { user },
    } = useAuth()
    const [selectedTab, setSelectedTab] = useState<string>()
    const {
        data: evaluationData,
        isLoading: isLoadingEvaluation,
        isError: IsErrorEvaluation,
        fetchStatus,
    } = useGetRights(entityId ?? '', { query: { enabled: !!user } })

    const userAbility = useUserAbility()
    const showEvaluation =
        evaluationData && evaluationData.hasVersions && !evaluationData.municipality && (evaluationData.creator || evaluationData.evaluator)
    const { data: ciTypeData } = useGetCiTypeWrapper(ENTITY_KRIS)
    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
        refetch,
        isRefetching,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })
    useCiCheckEntityTypeRedirectHook(ciItemData, ENTITY_KRIS)

    const { getHeading } = useCiListPageHeading(ciTypeData?.name ?? '', t)
    const { getTitle } = useCiDetailPageTitle(ciTypeData?.name ?? '', ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov], t)
    document.title = getTitle()

    const tabList: Tab[] = getDefaultCiEntityTabList({
        userAbility,
        entityName: ENTITY_KRIS ?? '',
        entityId: entityId ?? '',
        t,
    })

    tabList.splice(2, 0, {
        id: 'goals',
        path: `/ci/${ENTITY_KRIS}/${entityId}/goals`,
        title: t('ciType.goals'),
        content: <Outlet />,
    })

    !!user &&
        tabList.splice(5, 0, {
            id: 'tasks',
            path: `/ci/${ENTITY_KRIS}/${entityId}/tasks`,
            title: t('ciType.tasks'),
            content: <Outlet />,
        })

    showEvaluation &&
        tabList.splice(5, 0, {
            id: 'evaluation',
            path: `/ci/${ENTITY_KRIS}/${entityId}/evaluation`,
            title: t('ciType.evaluation'),
            content: <Outlet />,
        })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    return (
        <>
            <OutletProvider>
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                        ...getCiHowToBreadCrumb(ENTITY_KRIS, t),

                        { label: getHeading(), href: `/ci/${ENTITY_KRIS}` },
                        {
                            label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                            href: `/ci/${ENTITY_KRIS}/${entityId}`,
                        },
                    ]}
                />

                <MainContentWrapper>
                    <CiPermissionsWrapper entityId={entityId ?? ''} entityName={ENTITY_KRIS ?? ''}>
                        <QueryFeedback
                            loading={isCiItemDataLoading || (isLoadingEvaluation && fetchStatus != 'idle') || isRefetching}
                            error={isCiItemDataError || IsErrorEvaluation}
                            withChildren
                        >
                            <FlexColumnReverseWrapper>
                                <KrisEntityIdHeader
                                    editButton={
                                        <Button
                                            label={t('ciType.editButton')}
                                            onClick={() => navigate(`/ci/${ENTITY_KRIS}/${entityId}/edit`, { state: location.state })}
                                        />
                                    }
                                    entityData={ciItemData}
                                    entityName={ENTITY_KRIS}
                                    entityId={entityId ?? ''}
                                    entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                    isInvalidated={isInvalidated}
                                    refetchCi={refetch}
                                    isEvaluation={evaluationData?.inEvaluation ?? false}
                                />
                                <QueryFeedback loading={false} error={isCiItemDataError} />
                                <MutationFeedback
                                    success={isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated'}
                                    successMessage={
                                        isActionSuccess.additionalInfo?.type === 'create'
                                            ? t('mutationFeedback.successfulCreated')
                                            : t('mutationFeedback.successfulUpdated')
                                    }
                                />
                            </FlexColumnReverseWrapper>

                            <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />

                            {selectedTab === ciInformationTab && <KrisRelatedContainer currentKrisUuid={entityId ?? ''} />}
                        </QueryFeedback>
                    </CiPermissionsWrapper>
                </MainContentWrapper>
            </OutletProvider>
        </>
    )
}

export default KrisEntityDetailPage

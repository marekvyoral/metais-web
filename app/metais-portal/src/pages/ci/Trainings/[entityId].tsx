import { BreadCrumbs, Button, ButtonLink, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetTrainingsForUser, useUnregisterTrainee } from '@isdd/metais-common/api/generated/trainings-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, ENTITY_TRAINING, INVALIDATED, ciInformationTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useInvalidateTrainingsCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { getDefaultCiEntityTabList, getSuccessMessageKeyByType, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { TrainingContainer } from '@/components/containers/TrainingContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { TrainingEntityIdHeader } from '@/components/views/ci/trainings/TrainingEntityIdHeader'

const EntityDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()

    const {
        state: { user },
    } = useAuth()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedTab, setSelectedTab] = useState<string>()

    document.title = `${t('titles.ciDetail', { ci: entityName })} | MetaIS`
    const userAbility = useUserAbility()
    const ability = useUserAbility(entityName)
    const { invalidate } = useInvalidateTrainingsCache(entityId ?? '')

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')

    const { data: trainingData, isFetching: isTrainingFetching, isError: isTrainingError } = useGetTrainingsForUser({ query: { enabled: !!user } })

    const {
        mutateAsync: unregisterFromTraining,
        isLoading: isUnrerigsterLoading,
        isError: isUnrerigsterError,
    } = useUnregisterTrainee({
        mutation: {
            onSuccess: () => {
                invalidate()
                setIsActionSuccess({ value: true, path: `/${RouterRoutes.CI_TRAINING}/${entityId}`, additionalInfo: { type: 'unregister' } })
            },
        },
    })

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

    const isRegisteredOnTraining = useMemo(() => {
        return trainingData?.configurationItemSet?.some((training) => training.uuid === ciItemData?.uuid)
    }, [trainingData, ciItemData])

    const canRegisteredOnTraining = useMemo(() => {
        return ciItemData?.attributes?.[ATTRIBUTE_NAME.Profil_Skolenie_pocet_volnych_miest] > 0
    }, [ciItemData])

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: entityName ?? '', entityId: entityId ?? '', t })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess, scrollToMutationFeedback])

    const isLoading = [isCiItemDataLoading, isCiTypeDataLoading, isTrainingFetching, isUnrerigsterLoading].some((item) => item)
    const isError = [isCiItemDataError, isCiTypeDataError, isTrainingError, isUnrerigsterError].some((item) => item)

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
                    <QueryFeedback loading={isLoading}>
                        <FlexColumnReverseWrapper>
                            <TrainingEntityIdHeader
                                inviteButton={
                                    canRegisteredOnTraining &&
                                    (isRegisteredOnTraining ? (
                                        <Button
                                            label={t('trainings.unregisterFromTraining')}
                                            variant="warning"
                                            onClick={() => unregisterFromTraining({ trainingId: ciItemData?.uuid ?? '' })}
                                        />
                                    ) : (
                                        <Button
                                            label={t('trainings.registerForTraining')}
                                            onClick={() => navigate(`/ci/${entityName}/${entityId}/invite`, { state: location.state })}
                                        />
                                    ))
                                }
                                editButton={
                                    <ButtonLink
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${ENTITY_TRAINING}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityName={entityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <QueryFeedback loading={false} error={isError} />
                            {isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated' && (
                                <div ref={wrapperRef}>
                                    <MutationFeedback
                                        error={false}
                                        success={isActionSuccess.value}
                                        successMessage={t(getSuccessMessageKeyByType(isActionSuccess.additionalInfo?.type))}
                                    />
                                </div>
                            )}
                        </FlexColumnReverseWrapper>

                        <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />

                        <Can I={Actions.READ_TRAININGS} a={entityName ?? ''} ability={ability}>
                            {selectedTab === ciInformationTab && <TrainingContainer entityId={entityId ?? ''} entityName={entityName ?? ''} />}
                        </Can>
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage

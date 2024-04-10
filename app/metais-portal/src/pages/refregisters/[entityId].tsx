import { BreadCrumbs, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState, useGetReferenceRegisterByUuid } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { StateMachineStatesExtension, refRegisterStateMachine } from '@isdd/metais-common/components/state-machine/refRegistersStatusStateMachine'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useInterpret } from '@xstate/react'
import { createContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { InterpreterFrom } from 'xstate'
import { MutationFeedback, QueryKeysByEntity } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ciInformationTab } from '@isdd/metais-common/constants'
import { formatTitleString } from '@isdd/metais-common/utils/utils'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { RefRegisterItemsContainer } from '@/components/containers/refregisters/RefRegisterItemsContainer'
import { RefRegisterIdHeader } from '@/components/views/refregisters/RefRegisterIdHeader'
import { RefRegistersItemTable } from '@/components/views/refregisters/RefRegistersItemTable'
import Information from '@/pages/refregisters/[entityId]/information'
import { RefRegisterPermissionsWrapper } from '@/components/permissions/RefRegisterPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const INDEX_ROUTE = Information

export const RefRegisterStateMachine = createContext({
    stateMachineService: {} as InterpreterFrom<typeof refRegisterStateMachine>,
})

const RefRegistersDetail = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    const {
        state: { user },
    } = useAuth()
    const location = useLocation()
    const stateMachineService = useInterpret(refRegisterStateMachine)
    const currentState = stateMachineService?.getSnapshot()?.value
    const informationTab = {
        id: ciInformationTab,
        path: `/refregisters/${entityId}/`,
        title: t('refRegisters.detail.informations'),
        content: <Outlet />,
    }

    const { isActionSuccess } = useActionSuccess()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])

    const tabList: Tab[] = user
        ? [
              informationTab,
              {
                  id: 'history',
                  path: `/refregisters/${entityId}/history`,
                  title: t('refRegisters.detail.history'),
                  content: <Outlet />,
              },
              {
                  id: 'historyChanges',
                  path: `/refregisters/${entityId}/historyChanges`,
                  title: t('refRegisters.detail.historyChanges'),
                  content: <Outlet />,
              },
          ]
        : [informationTab]

    const {
        data: referenceRegisterData,
        isLoading,
        isError,
    } = useGetReferenceRegisterByUuid(entityId ?? '', {
        query: {
            queryKey: [QueryKeysByEntity.REFERENCE_REGISTER, entityId],
        },
    })

    const showList = location?.pathname?.endsWith(entityId ?? '') || location?.pathname?.endsWith(`${entityId}/`)

    useEffect(() => {
        if (!isLoading && stateMachineService && currentState === StateMachineStatesExtension.FETCHING) {
            stateMachineService?.send?.({ type: referenceRegisterData?.state?.toString() ?? ApiReferenceRegisterState.IN_CONSTRUCTION })
        }
    }, [referenceRegisterData, isLoading, currentState, stateMachineService])
    const refRegisterIdHeaderIsLoading = isLoading && currentState !== StateMachineStatesExtension.FETCHING

    document.title = formatTitleString(t('refRegisters.detail.title', { name: referenceRegisterData?.name ?? '' }))
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                    {
                        label: referenceRegisterData?.name ?? t('breadcrumbs.noName'),
                        href: `${RouteNames.REFERENCE_REGISTERS}/${entityId}`,
                    },
                ]}
            />

            <MainContentWrapper>
                <div ref={wrapperRef}>
                    <MutationFeedback success={isActionSuccess.value} />
                </div>
                <RefRegisterStateMachine.Provider value={{ stateMachineService }}>
                    <RefRegisterPermissionsWrapper
                        state={referenceRegisterData?.state}
                        owner={referenceRegisterData?.owner}
                        managerUuid={referenceRegisterData?.managerUuid}
                    >
                        <>
                            {!isLoading && (
                                <RefRegisterIdHeader
                                    entityId={entityId ?? ''}
                                    entityItemName={referenceRegisterData?.name ?? 'Detail'}
                                    isLoading={refRegisterIdHeaderIsLoading}
                                    isError={isError}
                                    owner={referenceRegisterData?.owner ?? ''}
                                />
                            )}
                            <Tabs tabList={tabList} />
                            {showList && (
                                <>
                                    <TextHeading size="L">{t('refRegisters.detail.items.heading')}</TextHeading>
                                    <RefRegisterItemsContainer
                                        entityId={entityId ?? ''}
                                        View={(props) => (
                                            <RefRegistersItemTable
                                                data={props?.data}
                                                handleFilterChange={props?.handleFilterChange}
                                                pagination={props?.pagination}
                                                isLoading={props.isLoading}
                                                isError={props.isError}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </>
                    </RefRegisterPermissionsWrapper>
                </RefRegisterStateMachine.Provider>
            </MainContentWrapper>
        </>
    )
}

export default RefRegistersDetail

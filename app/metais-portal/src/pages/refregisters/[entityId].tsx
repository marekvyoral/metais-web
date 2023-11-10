import { BreadCrumbs, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterState, useGetReferenceRegisterByUuid } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { StateMachineStatesExtension, refRegisterStateMachine } from '@isdd/metais-common/components/state-machine/refRegistersStatusStateMachine'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useInterpret } from '@xstate/react'
import { createContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { InterpreterFrom } from 'xstate'
import { QueryKeysByEntity } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { RefRegisterItemsContainer } from '@/components/containers/refregisters/RefRegisterItemsContainer'
import { RefRegisterIdHeader } from '@/components/views/refregisters/RefRegisterIdHeader'
import { RefRegistersItemTable } from '@/components/views/refregisters/RefRegistersItemTable'
import Informations from '@/pages/refregisters/[entityId]/informations'
import { RefRegisterPermissionsWrapper } from '@/components/permissions/RefRegisterPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const INDEX_ROUTE = Informations

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
        id: 'informations',
        path: `/refregisters/${entityId}/`,
        title: t('refRegisters.detail.informations'),
        content: <Outlet />,
    }

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

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                    {
                        label: referenceRegisterData?.isvsName ?? t('breadcrumbs.noName'),
                        href: `${RouteNames.REFERENCE_REGISTERS}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
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
                                    entityItemName={referenceRegisterData?.isvsName ?? 'Detail'}
                                    isLoading={refRegisterIdHeaderIsLoading}
                                    isError={isError}
                                />
                            )}
                            <Tabs tabList={tabList} />
                            {showList && (
                                <>
                                    <TextHeading size="XL">{t('refRegisters.detail.items.heading')}</TextHeading>
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

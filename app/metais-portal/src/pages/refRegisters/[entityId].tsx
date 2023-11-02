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

import { RefRegisterItemsContainer } from '@/components/containers/refRegisters/RefRegisterItemsContainer'
import { RefRegisterIdHeader } from '@/components/views/refRegisters/RefRegisterIdHeader'
import { RefRegistersItemTable } from '@/components/views/refRegisters/RefRegistersItemTable'
import Informations from '@/pages/refRegisters/[entityId]/informations'
import { RefRegisterPermissionsWrapper } from '@/components/permissions/RefRegisterPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const INDEX_ROUTE = Informations

export const RefRegisterStateMachine = createContext({
    stateMachineService: {} as InterpreterFrom<typeof refRegisterStateMachine>,
})

const RefRegistersDetail = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    const location = useLocation()
    const stateMachineService = useInterpret(refRegisterStateMachine)
    const currentState = stateMachineService?.getSnapshot()?.value

    const tabList: Tab[] = [
        {
            id: 'informations',
            path: `/refregisters/${entityId}/`,
            title: t('refRegisters.detail.informations'),
            content: <Outlet />,
        },
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
                    <RefRegisterPermissionsWrapper state={referenceRegisterData?.state}>
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
